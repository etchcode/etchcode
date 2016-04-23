import pdb

from pyparsing import *
import blocks

global_tokens = []


class Transformer:
    INPUT = "<l>%s</l>"
    VARIABLE = "<block var=\"%s\"/>"
    BLOCK_OPEN = "<block s=\"%s\">"
    BLOCK_OPEN2 = "<block s=\"%s\"><script>"
    BLOCK_CLOSE = "</block>"
    BLOCK_TAGS = BLOCK_OPEN + "%s" + BLOCK_CLOSE
    SCRIPT_TAGS = "\n<script x=\"0\" y=\"0\">%s</script>"
    SCRIPT_TAGS2 = "\n<script>%s</script>"

    def parse_and_transform(self, code_to_parse, variables):
        # functions that transform with setParseAction
        def prints(string, pos, tokens):
            # print(tokens)
            return tokens
        def parse_input(string, pos, tokens):
            return self.INPUT % (tokens[0])

        def parse_variable(string, pos, tokens):

            return self.VARIABLE % (tokens[0])

        def parse_function_call(string, pos, tokens):
            block_name = blocks.snap_names_lookup[tokens.pop(0).lower()]
            block_content = "".join(tokens)

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
            if type(tokens) != list:
                tokens = tokens.asList()[0]

            if type(tokens) == str:
                return tokens
            if len(tokens) <= 3:
                return expr_parse(tokens)
            else:
                parsed_expression = expr_parse(tokens[:3])
                recursing = parse_operator(string, pos, [parsed_expression] +
                                           tokens[3:])
                return recursing

        def parse_chunk_starter(string, pos, tokens):

            name = blocks.snapNames["control"][tokens[0].lower().replace(" ", "")]["snap"]
            return self.BLOCK_OPEN2 % (name) + tokens[1]

        def parse_chunk(string, pos, tokens):
            print "test"
            print tokens
            # print("tokens", tokens[1][0])
            if len(tokens) == 1:  # must be 2 so this is [[1, 2]] format:
                tokens = tokens[0]
            # print("tokens", tokens[1][0])
            # # + </block> because parse_chunk_starter only gives opening tag
            return tokens[0] + ("".join(tokens[1][0])) +\
                "</script></block>"
            return "test"
        def parse_hat_block(string, pos, tokens):
            print tokens
            if(len(tokens) == 1):
                return self.BLOCK_TAGS % (blocks.snapNames["events"][tokens[0].lower().replace(" ", "")]
                                      ["snap"], "")
            print(tokens[0].replace(" ", ""))
            return self.BLOCK_TAGS % (blocks.snapNames["events"][tokens[0].lower().replace(" ", "")]
                                      ["snap"], tokens[1])

        def parse_hatted_chunk(string, pos, tokens):
            token = tokens[0]

            # print tokens
            d = token.asDict()
            # print d
            hat = d["hat_block"]

            # print(hat)
            body_list = d["hat_content"].asList()
            # print body_list
            body_string = ""

            print("list",body_list)

            for k in body_list[0]:

                # print(body_string)
                # print k[0]
                body_string += str(k[0])
                # return "Test"
            # print body_string
            return self.SCRIPT_TAGS % (hat + body_string)
        def parse_if_chunk(string, pos, tokens):
            token = tokens[0]
            body_string = """<block s="doIfElse">"""

            print tokens
            body_list = token.asList()
            print body_list
            body_string += body_list[0]+"<script>"
            for k in body_list[1]:

                # print(body_string)
                # print k[0]
                body_string += str(k[0])
            body_string += "</script><script>"
            for k in body_list[2]:

                # print(body_string)
                # print k[0]
                body_string += str(k[0])

            body_string += "</script></block>"
            print body_string
            return body_string
        def parse_script(string, pos, tokens):
            """Parse a full script tag. At this point we just need to turn
            the list of one-deep lists into a string"""
            script_string = ""

            for token_list in tokens:
                script_string += "".join(token_list)

            return script_string

        indentationStack = [1]  # this is used in all the indentedBlock's
        # basic building blocks
        builtin = Combine(OneOrMore(Word(alphas)+Suppress(Optional(" ")))).setParseAction(prints)
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
        # chunk = Forward().setParseAction(parse_chunk)# Forward is placeholder
        # a line like `if foo:`
        ifChunck =  Forward()
        chunk_starter = (oneOf(blocks.startChunkBlocks, True) + Optional(an_input) +
                         Suppress(":")).setParseAction(parse_chunk_starter)
        # indented_chunk is what comes after `if foo:`

        indented_chunk = Forward()
        # here we define chunk that we initialized with Forward above

        ifChunck << Group(Suppress(CaselessLiteral("if"))+ Optional(an_input) + Suppress(":")+indented_chunk + Suppress(CaselessLiteral("else:"))+indented_chunk).setParseAction(parse_if_chunk)
        chuncks = Group(chunk_starter + indented_chunk)
        chunk = ifChunck ^chuncks
        # chunk.setParseAction(parse_chunk)
        indented_chunk << indentedBlock(function_call ^ chunk, indentationStack)
        # a line like `flag clicked :` or `key pressed 'a':```
        hat_block = (Combine(oneOf(blocks.hatBlocks, True)) + Optional(an_input) +
                     Suppress(":")).setParseAction(parse_hat_block)
        # `flag clicked:` and the indented text after it. function calls is for
        # if there is no additional indent in the text indented after it
        hat_chunk = Group(hat_block("hat_block") + indented_chunk("hat_content")).setParseAction(parse_hatted_chunk)


        script = OneOrMore(Group(hat_chunk))("script") + stringEnd
        script.setParseAction(parse_script)

        # just for ease-of-reading rename what we will parse against parser
        parser = script
        parser.ignore(pythonStyleComment)
    # support comments
        # make the string parsing function available throughout the class
        return parser.parseString(code_to_parse)[0]


if __name__ == "__main__":
    string = """
flag Clicked:
    S ay(1)

flag clicked:
    if touching(12): # yet another comment
        # full line
        Say(3)
        if 213 :

    else:
        Say(123)
    Say(123)




        """
    t = Transformer()
    print(t.parse_and_transform(string, ["var_1"]))
