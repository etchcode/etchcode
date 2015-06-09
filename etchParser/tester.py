__author__ = 'samschickler'
from xml_creator import xmlcreator
string = """e.flagclicked:
    l.think("213")
 """
main = xmlcreator()
print main.translates(string)