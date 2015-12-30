__author__ = 'samschickler'
from xml_creator import xmlcreator
from blocks import snapNames
print snapNames["motion"]["move"]["snap"]
string = """
flag Clicked:
    think("Hello, World") # l is short for looks
    Move(30+5)
    waIt(3)
    think("Etch is cool")
    go to xy(12, 21)
"""
variables = ["stas"]
sprites = ["foos213"]
print snapNames["motion"]["move"]["snap"]
main = xmlcreator()
print snapNames["motion"]["move"]["snap"]
print main.translates("", variables, sprites)
print snapNames["motion"]["move"]["snap"]

"""
<scripts><script x="116" y="14"> <block s="receiveGo"/><block s="forward"><l>12</l></block><block s="turn"><l>12</l></block><block s="doThink"><l>etch</l></block></script></scripts>
<scripts><script x="116" y="14"> <block s="receiveGo"/><block s="forward"><l>12</l></block><block s="turn"><l>12</l></block><block s="doThink"><l>etch</l></block></script></scripts>
"""

