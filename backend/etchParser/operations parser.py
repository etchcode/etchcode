from pyparsing import *
class Macro(object):
    def __init__(self, name, block):
        self.name = name
        self.block = block
        
    def __repr__(self):
        print self.name
        print "hi"
        return "#%s %s" % (self.name, self.block)
        
class Block(object):
    def __init__(self, content):
        self.content = content
        
    def __repr__(self):
        return "{ %s }" % ("".join([str(e) for e in self.content]))

lbrace = Literal("{")
rbrace = Literal("}")
decorator = Literal("#")

block = Forward()
macro = decorator + Word(alphas).setResultsName("name") + block.setResultsName("block")
macro.setParseAction(lambda t: Macro(t.name, t.block))

text = CharsNotIn("{}#")
content = macro ^ text

block << lbrace + ZeroOrMore(content).setResultsName("content") + rbrace
block.setParseAction(lambda t: Block(t.content))

if __name__ == "__main__":
    test = "#i{italic text #b{bolded}\n  \nfoobar\n\nbaz}"
    print macro.parseString(test)