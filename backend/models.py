"""Models for the appengine database."""
from google.appengine.ext import ndb


class User(ndb.Model):
    """A user of etch stored in ndb."""
    email = ndb.StringProperty(required=True)  # login indentifier
    # active controlls whether can log in
    active = ndb.BooleanProperty(required=True, default=True)

    # profile
    username = ndb.StringProperty(required=True)

    # projects
    def create_project(self, name, json, xml):
        project = Project(parent=self.key, name=name, json=json, xml=xml)
        return project.put()

    def get_projects(self):
        return Project.query(ancestor=self.key).fetch()


class Project(ndb.Model):
    name = ndb.StringProperty(required=True)
    JSON = ndb.TextProperty(required=True)
    # whenever JSON is changed, SnapXML must be changed as well
    SnapXML = ndb.TextProperty(required=True)
