class unreconizedFunction(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return repr(self.value)
class inputError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return repr(self.value)
class variableError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return repr(self.value)