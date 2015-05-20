
from pyparsing import *

class transformList:

    def __init__(self, string):
        self.string = string

    def transform(self):
        integer = Word(nums).setParseAction(lambda t:int(t[0]))
        variable = Word(alphas, exact=1)
        period = Suppress(Literal("."))
        func = Group(Word(alphas) + period + Group(OneOrMore(Word(alphas)))) #if it is a function inside a nother function
        operand = func | integer | variable  #types of values allowed in expressions
        signop = oneOf('+ -')
        multop = oneOf('* /')
        plusop = oneOf('+ -')

        expression = Suppress(Literal("(")) + operatorPrecedence( operand,
            [("!", 1, opAssoc.LEFT),
             ("^", 2, opAssoc.RIGHT),
             (signop, 1, opAssoc.RIGHT),
             (multop, 2, opAssoc.LEFT),
             (plusop, 2, opAssoc.LEFT),]
            )+ Suppress(Literal(")")) #parses the expression for example (2+3*4) = [2+[3*4]]
        regInput = Suppress(Literal("(")) + Group(operand + ZeroOrMore("," + operand)) + Suppress(Literal(")")) #regular input#expressions take presidence currently
        startCode = Word("events") + Suppress(Literal("."))+ Suppress(Optional(Word("when")))+Group(Word("flag") + Word("clicked")) + Suppress(Literal(":"))

        functions = Group(Word(alphas) + period + Group(OneOrMore(Word(alphas))) + expression | regInput + LineEnd())#all functions must be on new line

        scriptBlock = startCode + Group(OneOrMore(functions))
        fullCode = OneOrMore(Group(scriptBlock))
        return fullCode.parseString(self.string.lower())

