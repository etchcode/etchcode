from pyparsing import *

class transformList:

    def __init__(self, string):
        self.string = string

    def transform(self):
        integer = Word(nums).setParseAction(lambda t:int(t[0]))
        variable = Word(alphas)
        period = Suppress(Literal("."))
        string = QuotedString('"', escChar='\\')#Group(Suppress('''"''') + ZeroOrMore(oneOf(list(Word(alphanums)+ " "))) + Suppress('''"'''))("string")
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
        comments = Suppress(Optional(Literal("#") + restOfLine))
        operand = Group(func("func") | integer("integer") | variable("variable") | expression("expression")) | Group(string)
        regInput = Suppress(Literal("(")) + Group(operand +ZeroOrMore((Suppress(Literal(",")) | Suppress("to") )+ operand)) + Suppress(Literal(")")) #regular input#expressions take presidence currently
        startCode = Group(Word(alphas)+ period + Suppress(Optional(oneOf("when When")))+Group(OneOrMore(Word(alphas))) + Suppress(Literal(":")))#startCode = Group(CaselessKeyword("E") ^ CaselessKeyword("events") + period + Suppress(Optional(CaselessLiteral("when")))+Group(CaselessLiteral("flag") + CaselessLiteral("clicked")) + Suppress(Literal(":")))
        functions = Group(Word(alphas)("parent") + period + Group(OneOrMore(Word(alphas)))("child") +regInput("reginput"))("function")#all functions must be on new line
        ifstatement = Suppress(Literal("if")) + operand("op1") + oneOf("<= < >= > =")("relation") +  operand("op2") + Suppress(Literal(":")) + Suppress(LineEnd()) #regInput("reginput")
        ifgroup = Group(ifstatement + indentedBlock(allfunctions, [1])("functions"))
        allfunctions = OneOrMore(functions("function")+ comments)
        scriptBlock = Group(startCode("startcode") + comments+ OneOrMore(allfunctions)("functions"))
        fullCode = OneOrMore(scriptBlock("scriptblock"))
        return fullCode.parseString(self.string)