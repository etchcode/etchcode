__author__ = 'samschickler'
from xml_creator import xmlcreator
from blocks import snapNames
string = """
Events.when flag clicked:
    l.think(asd)

"""
variables = ["foo"]
sprites = ["asds"]
print snapNames["motion"]["move"]
main = xmlcreator()
print main.translates(string, variables, sprites, ["asd"])

"""
<scripts><script x="116" y="14"> <block s="receiveGo"/><block s="forward"><l>12</l></block><block s="turn"><l>12</l></block><block s="doThink"><l>etch</l></block></script></scripts>
<scripts><script x="116" y="14"> <block s="receiveGo"/><block s="forward"><l>12</l></block><block s="turn"><l>12</l></block><block s="doThink"><l>etch</l></block></script></scripts>
"""