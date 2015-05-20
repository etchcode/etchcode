import tokenize
import StringIO
import re
from blocks import * # our own python file with the blocks in it
from pyparsing import *
expression = Forward()
wordOrExpression = Word(nums) or expression
mult = Group( expression | alphanums + "*" + expression or alphanums)
addition = Group( expression | Word(nums) + "+" + expression or Word(nums))
expression = mult


fullCode = expression
print fullCode.parseString("2*2".lower())