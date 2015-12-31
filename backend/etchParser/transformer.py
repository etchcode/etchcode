# import pdb

from pyparsing import *  # NOQA
import blocks


class toList:
    INPUT = "<l>%s</l>"
    VARIABLE = "<block var=\"%s\"/>"
    BLOCK_OPEN = "<block s=\"%s\">"
    BLOCK_CLOSE = "</block>"
    BLOCK_TAGS = BLOCK_OPEN + "%s" + BLOCK_CLOSE
    SCRIPT_TAGS = "<script>%s</script>"

    def __init__(self, etch_code_string, variables):
        self.etch_code_string = etch_code_string  # the string we were passed

        # functions that transform with setParseAction
        def parse_input(string, pos, tokens):
            return self.INPUT % (tokens[0])

        def parse_variable(string, pos, tokens):
            return self.VARIABLE % (tokens[0])

        def parse_function_call(string, pos, tokens):
            block_name = tokens.pop(0)
            block_content = ""
            for token in tokens:
                block_content += token

            return self.BLOCK_TAGS % (block_name, block_content)

        def expr_parse(tokens):
            expression = tokens[1]
            result = self.BLOCK_OPEN % (blocks.snapNames["operators"]
                                        [expression]["snap"])

            if len(tokens[0]) != 1 and type(tokens[0]) == list:
                result += expr_parse(tokens[0])
            else:
                result += tokens[0]
            if len(tokens[2]) != 1 and type(tokens[2]) == list:
                result += expr_parse(tokens[2])
            else:
                result += tokens[2]

            result += self.BLOCK_CLOSE
            return result

        def parse_operator(string, pos, tokens):
            print("parse_op", tokens)
            if len(tokens[0]) > 3:
                return tokens[0]
            else:
                return expr_parse(tokens.asList()[0])

        def parse_chunk_starter(string, pos, tokens):
            name = blocks.snapNames["control"][tokens[0]]["snap"]
            return self.BLOCK_OPEN % (name) + tokens[1]

        def parse_chunk(string, pos, tokens):
            if len(tokens) == 1:  # must be 2 so this is [[1, 2]] format:
                tokens = tokens[0]

            return tokens[0] + self.SCRIPT_TAGS % ("".join(tokens[1][0]))

        def parse_hat_block(string, pos, tokens):
            return self.BLOCK_TAGS % (blocks.snapNames["events"][tokens[0]]
                                      ["snap"], "")

        indentationStack = [1]  # this is used in all the indentedBlock's
        # basic building blocks
        builtin = oneOf(blocks.that_behave_as_functions)
        integer = Word(nums).setParseAction(parse_input)
        variable = oneOf(variables).setParseAction(parse_variable)
        string = (QuotedString("\"", escChar="\\") ^
                  QuotedString("\'", escChar="\\")).\
            setParseAction(parse_input)

        # larger blocks

        function_call = Forward().setParseAction(parse_function_call)
        # Forward is placeholder, we define it later
        # as input to a function there can be int, str, var, function call
        function_input = integer ^ variable ^ string ^ Group(function_call)
        multop = oneOf('* /')
        plusop = oneOf('+ -')
        an_input = infixNotation(function_input, [
            (multop, 2, opAssoc.LEFT),
            (plusop, 2, opAssoc.LEFT),
            ("!", 1, opAssoc.LEFT),
            ("^", 2, opAssoc.RIGHT),
            ("%", 2, opAssoc.LEFT),
            ("and", 2, opAssoc.LEFT)
        ]).setParseAction(parse_operator)

        # no we define funcion call, this had to be done after input
        # because we use input in the deffinition
        function_call << builtin + Suppress("(") + ZeroOrMore(
            an_input + Suppress(Optional(","))) + Suppress(")")

        # chunk is a bunch of indented text with with a starter like an if
        # statement. we define it later so a chunk is able to contain a chunk
        chunk = Forward().setParseAction(parse_chunk)  # Forward is placeholder
        # a line like `if foo:`
        chunk_starter = (oneOf(blocks.startChunkBlocks) + Optional(an_input) +
                         Suppress(":")).setParseAction(parse_chunk_starter)
        # indented_chunk is what comes after `if foo:`
        indented_chunk = indentedBlock(function_call ^ chunk, indentationStack)
        # here we define chunk that we initialized with Forward above
        chunk << chunk_starter + indented_chunk

        # a line like `flag clicked:` or `key pressed 'a':```
        hat_block = (oneOf(blocks.hatBlocks) + Optional(an_input) +
                     Suppress(":")).setParseAction(parse_hat_block)
        # `flag clicked:` and the indented text after it. function calls is for
        # if there is no additional indent in the text indented after it
        hat_chunk = hat_block("hat_block") + indented_chunk("hat_content")

        script = OneOrMore(Group(hat_chunk))("st") + stringEnd  # full project

        # just for ease-of-reading rename what we will parse against parser
        parser = script
        parser.ignore(pythonStyleComment)  # support comments
        # make the string parsing function available throughout the class
        self.parse = parser.parseString

        # pdb.set_trace()

    def transform(self):
        # call the parse method defined in __init__
        return self.parse(self.etch_code_string)


if __name__ == "__main__":
    string = """
flag clicked: # a comment
    say(122 + 2 /  * 4 + 3) # another comment
    say(var_1)
    # full line comment
flag clicked:
    if 'fo' and 1: # yet another comment
        # full line
        if 'fa':
            say(3 * 2 + 1)"""
    print(toList(string, ["var_1"]).transform())
