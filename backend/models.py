"""Models for the appengine database."""
from google.appengine.ext import ndb
import json

# import defaults  # the equivilant of our defaults.js file


class User(ndb.Model):
    """A user of etch stored in ndb."""
    email = ndb.StringProperty(required=True)  # login indentifier
    # active controlls whether can log in
    active = ndb.BooleanProperty(required=True, default=True)

    # profile
    username = ndb.StringProperty(required=True)
    name = ndb.StringProperty()

    # projects
    def create_project(self, name, json, xml):
        project = Project(parent=self.key, name=name, JSON=json, SnapXML=xml)
        return project.put()

    def get_projects(self):
        return Project.query(ancestor=self.key).order(
            -Project.last_modified).fetch()


class Project(ndb.Model):
    name = ndb.StringProperty(required=True)
    # thumbnail = ndb.BlobProperty(required=True)
    JSON = ndb.TextProperty(required=True)
    # whenever JSON is changed, SnapXML must be changed as well
    SnapXML = ndb.TextProperty(required=True)

    # auto_now sets this when created/modified
    last_modified = ndb.DateTimeProperty(auto_now=True)

    def parsed_json(self):
        return json.loads(self.JSON)

    def get_thumbnail(self):
        if self.JSON == "{}":
            return False
        else:
            return self.parsed_json()["general"]["thumbnail"]

    # def create(name):
    #     """Creates project with default settings
    #     Takes: name
    #     Returns ndb Key"""
    #     return Project(name=name, JSON=)
