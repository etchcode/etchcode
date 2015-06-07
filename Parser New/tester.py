__author__ = 'samschickler'
from xml_creator import xmlcreator
string = """
e.flagclicked:
    m.move(motion.xpos)
    motion.gotoxy(0,0)
 """
main = xmlcreator()
print main.translates(string)