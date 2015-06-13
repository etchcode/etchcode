from pyparsing import *


class transformList:

    def __init__(self, string):
        self.string = string

    def transform(self):
        functions = Forward()
        period = Suppress(Literal("."))

        #These are different types of inputs
        integer = Word(nums).setParseAction(lambda t: int(t[0]))
        variable = Word(alphas)
        string = QuotedString('"', escChar='\\')
        func = Group(Word(alphas) + period + Group(OneOrMore(Word(alphas)))+ Optional(Suppress("("+")")))#this one is only for a function inside a nother function

        #this part parses input when it is a expressions following order of operations
        #negpos = oneOf('+ -') #this doesn't work currently in our xml_creator
        multop = oneOf('* /')
        plusop = oneOf('+ -')
        exprinputs = Group(func("func") ^ integer("integer") ^ variable("variable"))
        expression =  operatorPrecedence( exprinputs, #Optional(Suppress(Literal("("))) +
    [("!", 1, opAssoc.LEFT),
     ("^", 2, opAssoc.RIGHT),
     #(signop, 1, opAssoc.RIGHT),
     (multop, 2, opAssoc.LEFT),
     (plusop, 2, opAssoc.LEFT),]
    )#+ Optional(Suppress(Literal(")")))

        #this is combination of all of the inputs
        operand = Group(func("func") ^ integer("integer") ^ variable("variable") ^ string("string") ^ expression("expression"))
        #this makes it so you can put multiple inputs in a function
        regInput = Suppress(Literal("(")) + Group(operand + ZeroOrMore((Suppress(Literal(",")) | Suppress("to") )+ operand)) + Suppress(Literal(")"))

        """
        Currently if statements do not work
        What it should parse:
        if input >= input:
            function
            function
        function
        When run gives:
        pyparsing.ParseException:  (at char 37), (line:1, col:38)
        """
        ifstatement = Suppress(Literal("if")) + operand("op1") + oneOf("<= < >= > =")("relation") +  operand("op2")
        ifgroup = Group(Group(ifstatement) + indentedBlock(functions("functions"), [1]))


        comments = Suppress(Optional(Literal("#") + restOfLine))

        """
        startCode is a the beginning of each script block
        functions is a broad definition that uses regInput to recognize functions.
        allFunctions is recognizes if statments and functions with comments after them
        """
        startCode = Group(Word(alphas)+ period + Suppress(Optional(oneOf("when When")))+Group(OneOrMore(Word(alphas))) + Suppress(Literal(":")))#startCode = Group(CaselessKeyword("E") ^ CaselessKeyword("events") + period + Suppress(Optional(CaselessLiteral("when")))+Group(CaselessLiteral("flag") + CaselessLiteral("clicked")) + Suppress(Literal(":")))
        functions = Group(Word(alphas)("parent") + period + Group(OneOrMore(Word(alphas)))("child") +regInput("reginput"))("function")#all functions must be on new line
        allfunctions = OneOrMore(ifgroup + comments ^ functions("function")+ comments)

        """
        each script block includes when to start and then functions
        fullCode is a collection of scriptblocks
        """
        scriptBlock = Group(startCode("startcode") + comments + allfunctions("functions"))
        fullCode = OneOrMore(scriptBlock("scriptblock")) + StringEnd() #This raises a error if it doesn't finish parsing the string


        return fullCode.parseString(self.string)