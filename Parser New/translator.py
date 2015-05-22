
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
        negpos = oneOf('+ -')
        multop = oneOf('* /')
        plusop = oneOf('+ -')
        expression = operatorPrecedence( operand,
            [("!", 1, opAssoc.LEFT),
             ("^", 2, opAssoc.RIGHT),
             (negpos, 1, opAssoc.RIGHT),
             (multop, 2, opAssoc.LEFT),
             (plusop, 2, opAssoc.LEFT),]
            )
        expinput = Suppress(Literal("(")) + expression + Suppress(Literal(")")) #parses the expression for example (2+3*4) = [2+[3*4]]
        regInput = Suppress(Literal("(")) + Group(operand + ZeroOrMore("," + operand)) + Suppress(Literal(")")) #regular input#expressions take presidence currently
        startCode = Group(Word("events") + period+ Suppress(Optional(Word("when")))+Group(Word("flag") + Word("clicked")) + Suppress(Literal(":")))

        functions = Group(Word(alphas)("parent") + period + Group(OneOrMore(Word(alphas)))("child") + expinput("expinput") | regInput("reginput") + LineEnd())("function")#all functions must be on new line
        ifstatement = Word("if") + expression("expinput") | regInput("reginput") + oneOf("<= < >= > =")("relation") + expression("expinput") | regInput("reginput") + Suppress(Literal(":"))
        scriptBlock = Group(startCode("startcode") + Group(OneOrMore(functions))("functions"))
        fullCode = OneOrMore(scriptBlock("scriptblock"))
        return fullCode.parseString(self.string.lower())

