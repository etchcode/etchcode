from pyparsing import *  # NOQA
import blocks

class toList:
    INPUT = "<l>%s</l>"
    VARIABLE = "<block var=\"%s\"/>"
    OPERATOR = "<block s=\"%s\">%s</block>"

    def __init__(self, etch_code_string, variables):
        self.etch_code_string = etch_code_string  # the string we were passed

        # functions that transform with setParseAction
        def parse_input(string, pos, tokens):
            return self.INPUT % (tokens[0])

        def parse_variable(string, pos, tokens):
            return self.VARIABLE % (tokens[0])

        # def parse_operator(string, pos, tokens, so_far=""):
        #     if len(token) == 1:
        #         return so_far % token
        #     else:
        #         return OPERATORparse_operator(string, pos, tokens[0], so_far=so_far) +\

        indentationStack = [1]  # this is used in all the indentedBlock's
        # basic building blocks
        keyword = Word(alphanums)("keyword")
        integer = Word(nums).setParseAction(parse_input)
        variable = Word(alphanums + "_" + "-")("variable").\
            setParseAction(parse_variable)
        string = (QuotedString("\"", escChar="\\") ^
                  QuotedString("\'", escChar="\\")("string")).\
            setParseAction(parse_input)

        # larger blocks

        function_call = Forward()
        # Forward is placeholder, we define it later
        # as input to a function there can be int, str, var, function call
        function_input = integer ^ variable ^ string ^ Group(function_call)
        multop = oneOf('* /')
        plusop = oneOf('+ -')
        an_input = infixNotation(function_input, [
            ("!", 1, opAssoc.LEFT),
            ("^", 2, opAssoc.RIGHT),
            ("%", 2, opAssoc.LEFT),

            (multop, 2, opAssoc.LEFT),
            (plusop, 2, opAssoc.LEFT)
            ("and", 2, opAssoc.LEFT)
        ]).setParseAction(parse_operator)

        # no we define funcion call, this had to be done after input
        # because we use input in the deffinition
        function_call << keyword + Suppress("(") + ZeroOrMore(
            an_input + Suppress(Optional(","))) + Suppress(")")
        # an indented block of ONLY function calls, chunk below covers if there
        # is additional indented stuff in the block
        function_calls = indentedBlock(function_call,
                                       indentationStack)

        # chunk is a bunch of indented text with with a starter like an if
        # statement. we define it later so a chunk is able to contain a chunk
        chunk = Forward()  # Forward is a placeholder
        chunk_starter = oneOf(blocks.startChunkBlocks) +\
            Optional(an_input) + Suppress(":")  # a line like `if foo:`
        # indented_chunk is what comes after `if foo:`
        indented_chunk = indentedBlock(function_call ^ chunk, indentationStack)
        # here we define chunk that we initialized with Forward above
        chunk << chunk_starter + indented_chunk

        hat_block = oneOf(blocks.hatBlocks) + Optional(an_input) +\
            Suppress(":")  # a line like `flag clicked:` or `key pressed 'a':`
        # `flag clicked:` and the indented text after it. function calls is for
        # if there is no additional indent in the text indented after it
        hat_chunk = hat_block("hat") +\
            (function_calls ^ Group(OneOrMore(chunk)))("hat")

        script = OneOrMore(Group(hat_chunk))("st") + stringEnd  # full project

        # just for ease-of-reading rename what we will parse against parser
        parser = script
        parser.ignore(pythonStyleComment)  # support comments
        # make the string parsing function available throughout the class
        self.parse = parser.parseString

    def transform(self):
        # call the parse method defined in __init__
        return self.parse(self.etch_code_string)


if __name__ == "__main__":
    string = """
flag clicked: # a comment
    say("hi"+ 122) # another comment
    say(var_1)
    # full line comment
flag clicked:
    if 'fo' and 1: # yet another comment
        # full line
        if 'fa':
            say(3 * 2 + 1)"""
    print(toList(string, ["var_1"]).transform())
