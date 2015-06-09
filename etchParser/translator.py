__author__ = 'samschickler'
from xml_creator import xmlcreator
def translate(string):
    print "input"
    if string.replace(" ", "") == "":
        return ""
    print string
    main = xmlcreator()
    return main.translates(string)