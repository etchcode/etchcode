from pyparsing import Word, OneOrMore, alphanums, nums, QuotedString,\
    Suppress, Forward, oneOf, Group, Optional, indentedBlock, ZeroOrMore,\
    stringEnd, pythonStyleComment
import blocks


class toList:
    def __init__(self, etch_code_string):
        self.etch_code_string = etch_code_string

        indentationStack = [1]

        # basic building blocks
        keyword = Word(alphanums)
        integer = Word(nums).setParseAction(lambda i: int(i[0]))
        variable = Word(alphanums + "_" + "-")
        # operator = oneOf("+ - * /")
        string = QuotedString("\"", escChar="\\") ^\
            QuotedString("\'", escChar="\\")

        # larger blocks
        function_call = Forward()
        function_input = integer ^ variable ^ string ^ Group(function_call)
        function_call << keyword + Suppress("(") + ZeroOrMore(
            function_input + Suppress(Optional(","))) + Suppress(")")
        function_calls = indentedBlock(function_call,
                                       indentationStack)

        chunk = Forward()
        chunk_starter = oneOf(blocks.startChunkBlocks) +\
            Optional(function_input) + Suppress(":")
        indented_chunk = indentedBlock(function_call ^ chunk, indentationStack)
        chunk << chunk_starter + indented_chunk

        hat_block = oneOf(blocks.hatBlocks) + Optional(function_input) +\
            Suppress(":")
        hat_chunk = hat_block + (function_calls ^ OneOrMore(chunk))

        # largest blocks
        script = OneOrMore(Group(hat_chunk)) + stringEnd

        # just for ease-of-reading rename what we will parse against parser
        parser = script
        parser.ignore(pythonStyleComment)
        # make the string parsing function available throughout the class
        self.parse = parser.parseString

    def transform(self):
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
