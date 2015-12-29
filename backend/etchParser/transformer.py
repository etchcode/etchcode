from pyparsing import Word, OneOrMore, alphanums, nums, QuotedString,\
    Suppress, Forward, oneOf, Group, Optional, indentedBlock, ZeroOrMore,\
    stringEnd, pythonStyleComment
import blocks


class toList:
    def __init__(self, etch_code_string):
        self.etch_code_string = etch_code_string  # the string we were passed

        indentationStack = [1]  # this is used in all the indentedBlock's

        # basic building blocks
        keyword = Word(alphanums)
        integer = Word(nums).setParseAction(lambda i: int(i[0]))
        variable = Word(alphanums + "_" + "-")
        # operator = oneOf("+ - * /") #TODO: Add operator support
        string = QuotedString("\"", escChar="\\") ^\
            QuotedString("\'", escChar="\\")

        # larger blocks
        function_call = Forward()  # Forward is placeholder, we define it later
        # as input to a function there can be int, str, var, function call
        function_input = integer ^ variable ^ string ^ Group(function_call)
        # no we define funcion call, this had to be done after function_input
        # because we use function_input in the deffinition
        function_call << keyword + Suppress("(") + ZeroOrMore(
            function_input + Suppress(Optional(","))) + Suppress(")")
        # an indented block of ONLY function calls, chunk below covers if there
        # is additional indented stuff in the block
        function_calls = indentedBlock(function_call,
                                       indentationStack)

        # chunk is a bunch of indented text with with a starter like an if
        # statement. we define it later so a chunk is able to contain a chunk
        chunk = Forward()  # Forward is a placeholder
        chunk_starter = oneOf(blocks.startChunkBlocks) +\
            Optional(function_input) + Suppress(":")  # a line like `if foo:`
        # indented_chunk is what comes after `if foo:`
        indented_chunk = indentedBlock(function_call ^ chunk, indentationStack)
        # here we define chunk that we initialized with Forward above
        chunk << chunk_starter + indented_chunk

        hat_block = oneOf(blocks.hatBlocks) + Optional(function_input) +\
            Suppress(":")  # a line like `flag clicked:` or `key pressed 'a':`
        # `flag clicked:` and the indented text after it. function calls is for
        # if there is no additional indent in the text indented after it
        hat_chunk = hat_block + (function_calls ^ OneOrMore(chunk))

        script = OneOrMore(Group(hat_chunk)) + stringEnd  # a full project

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
    say("hi") # another comment
    # full line comment
flag clicked:
    if 'fo': # yet another comment
        # full line
        if 'fa':
            say("second parallel hat block!")"""
    print(toList(string).transform())
