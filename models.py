from google.appengine.ext import ndb


class User(ndb.Model):  # a user of etch
    email = ndb.StringProperty()
    name = ndb.StringProperty()
    googleUserID = ndb.StringProperty()


class Project(ndb.Model):
    projectName = ndb.StringProperty()
    googleUserID = ndb.StringProperty()

    jsonFile = ndb.TextProperty()
    xmlFile = ndb.TextProperty()
