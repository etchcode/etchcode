__author__ = 'samschickler'
from xml_creator import xmlcreator
def translate(string):
    print "input"
    if string.replace(" ", "") == "":
        return '''<script x="0" y="0"></scripts>'''
    print string
    main = xmlcreator()
    return main.translates(string)