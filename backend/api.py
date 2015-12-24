from flask import Flask, Response, request, redirect
from flask.ext.login import LoginManager, UserMixin, login_required, \
    login_user, logout_user, current_user

from google.appengine.api import urlfetch

import json
import os
import urllib

# import of own files
import models

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

# login code
login_manager = LoginManager()
login_manager.init_app(app)


class User:
    """
    Class used by Flask login. Most of this stuff is Flask defaults
    """

    def __init__(self, user_object):
        self.id = int(user_object.key.id())
        self.is_active = user_object.active
        self.get_projects = user_object.get_projects

        self.profile = {
            "username": user_object.username
        }

        # Defaults for all authenticated users
        self.is_authenticated = True
        self.is_anonymous = False

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


# error handlers
@app.errorhandler(401)
def error401(e):
    """
    Take nothing and return JSON 401 error page
    :return: JSON 401 error page
    """
    print str(current_user)
    return json.dumps({
        "status": "failure",
        "error": "401",
        "message": "Access Forbidden"}), 401


@app.route("/api/login", methods=["POST"])
def login():
    """Get: mozilla persona token
    Sets: user session
    """
    assertion = request.data.decode()

    response = urlfetch.fetch(url='https://verifier.login.persona.org/verify',
                              payload=urllib.urlencode({'assertion': assertion,
                                                       'audience': URL}),
                              method=urlfetch.POST)

    # Did the verifier respond?
    if response.status_code == 200:
        # Parse the response
        verification_data = json.loads(response.content)

        # Check if the assertion was valid
        if verification_data['status'] == 'okay':
            user = load_user_by_email(verification_data["email"])

            if user:
                login_user(user)

                return redirect("/api/user")
            else:
                return json.dumps({
                    "status": "failure",
                    "message": "User does not exist"}), 401

    # Oops, something failed. Abort.
    return json.dumps({"status": "failure"}), 500


@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    print("logging out")

    return json.dumps({"status": "success"}), 200


# routes
@app.route("/api/blocks.json")
def blocks():
    """
    Take nothing
    :return: data on all the blocks.
    """
    print "is_authenticated: " + str(current_user.is_authenticated)

    # TODO: This should return docs on the blocks
    from etchParser import blocks

    return Response(json.dumps({
        "closeSelf": blocks.closeSelf,
        "snapNames": blocks.snapNames,
        "startChunkBlocks": blocks.startChunkBlocks,
        "abbreviations": blocks.abriviations
    }), content_type="application/json")


@app.route("/api/parse", methods=["POST"])
def parse():
    """Get: request paramater scripts with list of script object as generated
    by services/render.js that is json encoded
    Return: Parsed scripts
    """

    try:
        from etchParser import translator

        scripts = json.loads(json.loads(request.data.decode())["scripts"])
        variables = ["hi"]
        sprites = json.loads(json.loads(request.data.decode())["sprites"])
        # don't use request.form because ng transmits data as json

        parsed = {}
        for name in scripts:
            parsed[name] = translator.translate(scripts[name],  # translate it
                                                sprites, variables)

        return Response(json.dumps(parsed), content_type="application/json")

    except Exception as error:
        return Response(json.dumps({"error": str(error)}),
                        content_type="application/json", status="500")


@app.route("/api/user", methods=["GET"])
@login_required
def user():
    if request.method == "GET":  # get request, so show the user data
        return json.dumps({
            "profile": current_user.profile,
            "projects": current_user.get_projects()
        })
