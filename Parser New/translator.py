import tokenize
import StringIO
import re
from blocks import * # our own python file with the blocks in it
from pyparsing import *
expression = Forward()
startCode = Word("events") + Suppress(Literal("."))+ Group(Word("flag") + Word("clicked")) + Suppress(Literal(":"))
expression = Group(Word(nums)| expression+ Word("+-*/", max = 1) + Word(nums) | expression)
functions = Word(alphas) + Suppress(Literal(".")) + Group(OneOrMore(Word(alphas))) + Suppress("(") + expression

fullCode = startCode + Group(OneOrMore(functions))
print fullCode.parseString("events.flag Clicked: events.hi g(2+4+3".lower())
