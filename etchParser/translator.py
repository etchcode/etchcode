__author__ = 'samschickler'
from xml_creator import xmlcreator
def translate(string, variables, sprites):
    print "input"
    if string.replace(" ", "") == "":
        return "<scripts></scripts>"
    print string
    main = xmlcreator()

    x = main.translates(string, variables, sprites)
    print x
    return x