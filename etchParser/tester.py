__author__ = 'samschickler'
from xml_creator import xmlcreator
string = """
e.flagclicked:
    m.move(motion.xpos) # 1213 asd:
    motion.gotoxy(0, 0) #1234
 """
main = xmlcreator()
print main.translates(string)