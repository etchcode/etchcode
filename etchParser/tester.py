__author__ = 'samschickler'
from xml_creator import xmlcreator
string = """E.flagClicked:
	L.think("Etch is cool")
"""
main = xmlcreator()
print main.translates(string)

"""
<scripts><script x="116" y="14"> <block s="receiveGo"/><block s="forward"><l>12</l></block><block s="turn"><l>12</l></block><block s="doThink"><l>etch</l></block></script></scripts>
<scripts><script x="116" y="14"> <block s="receiveGo"/><block s="forward"><l>12</l></block><block s="turn"><l>12</l></block><block s="doThink"><l>etch</l></block></script></scripts>
"""