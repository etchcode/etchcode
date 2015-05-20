import tokenize
import StringIO
import re
from blocks import * # our own python file with the blocks in it
from pyparsing import *

integer = Word(nums).setParseAction(lambda t:int(t[0]))
variable = Word(alphas, exact=1)
func =Group(Word(alphas) + Suppress(Literal(".")) + Group(OneOrMore(Word(alphas))))
operand = func | integer | variable
expop = Literal('^')
signop = oneOf('+ -')
multop = oneOf('* /')
plusop = oneOf('+ -')
factop = Literal('!')
expression = operatorPrecedence( operand,
    [("!", 1, opAssoc.LEFT),
     ("^", 2, opAssoc.RIGHT),
     (signop, 1, opAssoc.RIGHT),
     (multop, 2, opAssoc.LEFT),
     (plusop, 2, opAssoc.LEFT),]
    )
input = Group(operand + ZeroOrMore("," + operand))
startCode = Word("events") + Suppress(Literal("."))+ Suppress(Optional(Word("when")))+Group(Word("flag") + Word("clicked")) + Suppress(Literal(":"))

functions = Word(alphas) + Suppress(Literal(".")) + Group(OneOrMore(Word(alphas))) + Suppress("(") + expression or input + Suppress(")") + LineEnd()

scriptBlock = startCode + Group(OneOrMore(functions))
fullCode = OneOrMore(Group(scriptBlock))
print fullCode.parseString("""events.whenflag Clicked: events.hi g(2+3*x.ty re*21)
 events.hi dg(2+3*221*21)
 """.lower())
