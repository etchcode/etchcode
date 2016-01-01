import pdb

from flask import Flask, Response, request, redirect, abort
from flask.ext.login import LoginManager, UserMixin, login_required, \
    login_user, logout_user, current_user
import jinja2
import copy

from google.appengine.api import urlfetch
from google.appengine.ext import ndb

import json
import os
import urllib

# import of own files
import models
from etchParser import translator, blocks
from etchParser.translator import ParseException

# handle setting globals based on if this is a dev or production environment
if os.environ["SERVER_SOFTWARE"].startswith("Development"):
    PRODUCTION = False
    URL = "http://localhost:9090"
elif os.environ["SERVER_SOFTWARE"].startswith("Google"):
    PRODUCTION = True
    URL = "http://etchcode.org:80"
else:
    print "unknown environment " + os.environ["SERVER_SOFTWARE"]

# init code
app = Flask("api")
app.config.from_pyfile("config.py")


# use a custom response class
class JsonResponse(Response):
    default_mimetype = "application/json"


app.response_class = JsonResponse

# custom errors


class ApiError(Exception):
    def __init__(self, message=None, status_code=400):
        self.message = message
        self.status_code = status_code

    def __str__(self):
        return json.dumps({
            "status": "failure",
            "error_code": self.status_code,
            "message": self.message
        })

# login code
login_manager = LoginManager()
login_manager.init_app(app)


class User:
    """
    Class used by Flask login. Most of this stuff is Flask defaults
    """

    def __init__(self, user_model):
        self.user_model = user_model
        self.key = self.user_model.key
        self.id = int(self.key.id())
        self.is_active = user_model.active

        self.get_projects = user_model.get_projects
        self.create_project = user_model.create_project

        self.profile = {
            "username": user_model.username,
            "email": user_model.email,
            "name": user_model.name
        }

        # Defaults for all authenticated users
        self.is_authenticated = True
        self.is_anonymous = False

    def owns_project(self, project_key):
        if project_key.parent() == self.key:
            return True
        else:
            return False

    def get_id(self):
        try:
            return unicode(self.id)
        except AttributeError:
            raise NotImplementedError('No `id` attribute - override `get_id`')

    def __eq__(self, other):
        '''
        Checks the equality of two `UserMixin` objects using `get_id`.
        '''
        if isinstance(other, UserMixin):
            return self.get_id() == other.get_id()
        return NotImplemented

    def __ne__(self, other):
        '''
        Checks the inequality of two `UserMixin` objects using `get_id`.
        '''
        equal = self.__eq__(other)
        if equal is NotImplemented:
            return NotImplemented
        return not equal


@login_manager.user_loader
def load_user(user_id):
    user = models.User.get_by_id(int(user_id))

    if user:  # user exists
        return User(user)

    else:
        return None


def load_user_by_email(email):
    """
    Returns a User object (not models.User) for the specified email.
    this is useful for signing in with Flask
    :param email: the email of the user. assumed to be unique
    :return: User object or None
    """
    user = models.User.query(models.User.email == email).get()
    if user:
        return load_user(user.key.id())
    else:
        return None


def verify_assertion(assertion):
    verification_url = "https://verifier.login.persona.org/verify"
    response = urlfetch.fetch(url=verification_url,
                              payload=urllib.urlencode({'assertion':
                                                        assertion,
                                                       'audience': URL}),
                              method=urlfetch.POST)

    # Did the verifier respond?
    if response.status_code == 200:
        # Parse the response
        verification_data = json.loads(response.content)

        # Check if the assertion was valid
        if verification_data['status'] == 'okay':
            return verification_data["email"]

    return False  # something went wrong


def username_unique(username):
    matches = models.User.query(models.User.username == username).fetch()
    if len(matches) == 0:
        return True
    else:
        return False


def email_unique(email):
    matches = models.User.query(models.User.email == email).fetch()
    if len(matches) == 0:
        return True
    else:
        return False


# error handlers
@app.errorhandler(401)
def error401(e):
    """
    Take nothing and return JSON 401 error page
    :return: JSON 401 error page
    """
    return json.dumps({
        "status": "failure",
        "error": "401",
        "message": "Access Forbidden"}), 401


@app.errorhandler(ApiError)
def api_error(error):
    return str(error), error.status_code


@app.route("/api/login", methods=["GET", "POST"])
def login():
    """Get: mozilla persona token
    Sets: user session
    """
    # a cheat if we are on a dev server to quickly login
    # could be a GET in development
    if request.method == "POST":  # normal method must be post
        assertion = request.data.decode()
        verified = verify_assertion(assertion)
        user = load_user_by_email(verified)

        if verified and user:
            login_user(user)
            return redirect("/api/user")

    elif not PRODUCTION and request.args["fake-login"] == "true":
        user = load_user_by_email(request.args["email"])
        login_user(user)
        return redirect("/api/user")

    # something failed. Abort.
    abort(401)


@app.route("/api/logout", methods=["GET", "POST"])
@login_required
def logout():
    if request.method == "POST":
        logout_user()
        return json.dumps({"status": "success"})

    elif not PRODUCTION and request.args["fake-logout"] == "true":
        logout_user()
        return json.dumps({"status": "sucess"})


@app.route("/api/user", methods=["GET", "POST"])
# we check login for get but not post
def user():
    if request.method == "GET":
        if current_user.is_authenticated:
            return json.dumps({
                "profile": current_user.profile,
            })
        else:
            abort(401)

    elif request.method == "POST":
        request_data = json.loads(request.data.decode())
        email = verify_assertion(request_data["assertion"])
        username = request_data["username"]
        name = request_data["name"]

        if email and email_unique(email) and username_unique(username):
            new_user = models.User(email=email, active=True, username=username,
                                   name=name)
            new_user.put()
            login_user(User(new_user))  # make it a User object for Flask
            return redirect("/api/user")
        else:
            raise ApiError(message="invalid email or username")


@app.route("/api/user/profile", methods=["GET", "PUT"])
@login_required
def user_profile():
    if request.method == "GET":
        return json.dumps(current_user.profile)

    elif request.method == "PUT":
        request_data = json.loads(request.data.decode())
        user = current_user.user_model

        if "username" in request_data:
            new_username = request_data["username"]
            if username_unique(new_username):
                user.username = new_username
            else:
                raise ApiError(message="Username already exists")
        if "name" in request_data:
            new_name = request_data["name"]
            user.name = new_name

        user.put()

        return json.dumps({
            "message": "success"
        })


@app.route("/api/blocks.json")
def blocks_response():
    """
    Take nothing
    :return: data on all the blocks.
    """

    return json.dumps({
        "closeSelf": blocks.closeSelf,
        "snapNames": blocks.snapNames,
        "startChunkBlocks": blocks.startChunkBlocks,
        "abbreviations": blocks.abriviations
    })


@app.route("/api/parse", methods=["POST"])
@login_required
def parse():
    """Get: request paramater scripts with list of script object as generated
    by services/render.js that is json encoded
    Return: Parsed scripts
    """
    request_data = json.loads(request.data.decode())

    scripts = request_data["scripts"]
    variables = request_data["variables"]
    global_variables = request_data["global_variables"]
    sprites = request_data["sprites"]

    parsed = {}
    Translator = translator.Translator()

    return json.dumps(parsed)


@app.route("/api/project", methods=["GET", "POST", "DELETE"])
@login_required
def project():
    # get the project id from the request and check that the project exists
    project_key = ndb.Key(urlsafe=request.args["key"])
    project = project_key.get()
    if not project:
        raise ApiError(message="Project doesn't exist")
    # modifying request and  current user doesn't own
    elif request.method != "GET" and not \
            current_user.owns_project(project_key):
        raise ApiError(message="Current user may not access specified project",
                       status_code=401)

    if request.method == "GET":
        return json.dumps({
            "sprites": json.loads(project.JSON),
            "name": project.name
        })

    elif request.method == "POST":
        project_json = json.loads(request.data.decode())
        sprites_json = project_json["sprites"]

        # set the project name
        project.name = project_json["name"]

        # set the project JSON
        project.JSON = json.dumps(project_json["sprites"])

        # parse JSON into SnapXML. this must be done server-side so that the
        # user cant't give us arbitrary xml

        project_template_enviroment = jinja2.Environment(
            loader=jinja2.FileSystemLoader(os.path.join(
                os.path.split(__file__)[0],
                "../templates/project"
            )))

        project_template = project_template_enviroment.get_template(
            "snap_template.xml")

        all_sprites = copy.copy(sprites_json["list"])
        all_sprites.append(sprites_json["background"])
        all_sprites.append(sprites_json["general"])

        sprite_ids = []
        for sprite in all_sprites:
            sprite_ids.append(sprite["id"])

        scripts = {}
        Translator = translator.Translator()
        for sprite in all_sprites:
            if "script" in sprite:  # skip globals which has no script
                global_variables = sprites_json["general"]["variables"]
                variables = sprite["variables"]
                variables.append(global_variables)
                scripts[sprite["id"]] = Translator.translate(sprite["script"],
                                                             variables)

        rendered_template = project_template.render(project={
            "scripts": scripts,
            "sprites": sprites_json["list"],
            "globals": sprites_json["general"],
            "background": sprites_json["background"]
        })

        # store the rendered SnapXML
        project.SnapXML = rendered_template

        # save the modified project
        project.put()

        return json.dumps({
            "success": True
        })

    elif request.method == "DELETE":
        project_key.delete()

        return json.dumps({
            "success": True
        })


@app.route("/api/project/create", methods=["POST"])
@login_required
def create_project():
    key = current_user.create_project(request.args["name"], "{}", "")

    return json.dumps({
        "key": key.urlsafe()
    })


@app.route("/api/projects", methods=["GET"])
@login_required
def projects():
    all_projects = current_user.get_projects()

    id_list = []
    for project in all_projects:
        id_list.append({
            "key": project.key.urlsafe(),
            "name": project.name,
            "thumbnail": project.get_thumbnail()
        })

    return json.dumps({
        "projects": id_list
    })
