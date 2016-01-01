import json
from google.appengine.api import urlfetch


class Tracker:
    """Class to track a heap user
    Takes: heap app id (str), user identifier (str)
    """
    def __init__(self, app_id_, identifier_):
        self.app_id = app_id_
        self.identifier = identifier_

    # non-public functions
    def _api_call(self, method, data):
        url = "https://heapanalytics.com/api/" + method
        urlfetch.fetch(url, payload=json.dumps(data), method=urlfetch.POST,
                       headers={"Content-Type": "application/json"})

    # public functions
    def event(self, event_, properties_={}):
        """Create a new heap event
        Takes: event name (str), optional event properties (dict)
        """
        return self._api_call("track", {
            "app_id": self.app_id,
            "identity": self.identifier,
            "event": event_,
            "properties": properties_
        })

    def identify(self, new_properties):
        """Add properties to user as tracked by heap
        Takes: new properties (dict)
        """
        return self._api_call("identify", {
            "app_id": self.app_id,
            "identity": self.identifier,
            "properties": new_properties
        })
