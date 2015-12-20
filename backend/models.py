from google.appengine.ext import ndb


class User(ndb.Model):  # a user of etch
	email = ndb.StringProperty() # login indentifier
	active = ndb.BooleanProperty() # are they allowed to log in?

	# profile
	username = ndb.StringProperty()