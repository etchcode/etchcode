__author__ = 'samschickler'
from xml_creator import xmlcreator
def translate(string, variables, sprites, costumes):
    print "input"
    if string.replace(" ", "") == "":
        return "<scripts></scripts>"
    print string
    main = xmlcreator()
    return main.translates(string, variables,sprites)