from pyparsing import *

class transformList:

    def __init__(self, string):
        self.string = string

    def transform(self):
        integer = Word(nums).setParseAction(lambda t:int(t[0]))
        variable = Word(alphas)
        period = Suppress(Literal("."))
        string = Group(Suppress('''"''') + ZeroOrMore(Word(alphanums)) + Suppress('''"'''))
        func = Group(Word(alphas) + period + Group(OneOrMore(Word(alphas)))) #if it is a function inside a nother function
        operand = Forward()  #types of values allowed in expressions
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
        allfunctions = Forward()
        operand = Group(func("func") | integer("integer") | variable("variable") | expression("expression")) | string("string")
        regInput = Suppress(Literal("(")) + Group(operand +ZeroOrMore((Suppress(Literal(",")) | Suppress("to") )+ operand)) + Suppress(Literal(")")) #regular input#expressions take presidence currently
        startCode = Group(oneOf("events e")+ period + Suppress(Optional(Word("when")))+Group(Word("flag") + Word("clicked")) + Suppress(Literal(":")))
        functions = Group(Word(alphas)("parent") + period + Group(OneOrMore(Word(alphas)))("child") +regInput("reginput"))("function")#all functions must be on new line
        ifstatement = Suppress(Literal("if")) + operand("op1") + oneOf("<= < >= > =")("relation") +  operand("op2") + Suppress(Literal(":")) + Suppress(LineEnd()) #regInput("reginput")
        ifgroup = Group(ifstatement + indentedBlock(allfunctions, [1])("functions"))
        allfunctions = OneOrMore(ifgroup | functions("function"))
        scriptBlock = Group(startCode("startcode") + OneOrMore(allfunctions)("functions"))
        fullCode = OneOrMore(scriptBlock("scriptblock"))
        return fullCode.parseString(self.string.lower())