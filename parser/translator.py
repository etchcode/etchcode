import tokenize
import StringIO
import re

import blocks # our own python file with the blocks in it

tokenTypes = {
    0: 'ENDMARKER',
    1: 'NAME',
    2: 'NUMBER',
    3: 'STRING',
    4: 'NEWLINE',
    5: 'INDENT',
    6: 'DEDENT',
    7: 'LPAR',
    8: 'RPAR',
    9: 'LSQB',
    10: 'RSQB',
    11: 'COLON',
    12: 'COMMA',
    13: 'SEMI',
    14: 'PLUS',
    15: 'MINUS',
    16: 'STAR',
    17: 'SLASH',
    18: 'VBAR',
    19: 'AMPER',
    20: 'LESS',
    21: 'GREATER',
    22: 'EQUAL',
    23: 'DOT',
    24: 'PERCENT',
    25: 'BACKQUOTE',
    26: 'LBRACE',
    27: 'RBRACE',
    28: 'EQEQUAL',
    29: 'NOTEQUAL',
    30: 'LESSEQUAL',
    31: 'GREATEREQUAL',
    32: 'TILDE',
    33: 'CIRCUMFLEX',
    34: 'LEFTSHIFT',
    35: 'RIGHTSHIFT',
    36: 'DOUBLESTAR',
    37: 'PLUSEQUAL',
    38: 'MINEQUAL',
    39: 'STAREQUAL',
    40: 'SLASHEQUAL',
    41: 'PERCENTEQUAL',
    42: 'AMPEREQUAL',
    43: 'VBAREQUAL',
    44: 'CIRCUMFLEXEQUAL',
    45: 'LEFTSHIFTEQUAL',
    46: 'RIGHTSHIFTEQUAL',
    47: 'DOUBLESTAREQUAL',
    48: 'DOUBLESLASH',
    49: 'DOUBLESLASHEQUAL',
    50: 'AT',
    51: 'OP',
    52: 'ERRORTOKEN',
    53: 'COMMENT',
    54: 'NL',
    55: 'N_TOKENS',
    256: 'NT_OFFSET'
}

ignoreStrings = [
    "(",
    ",",
    "."
]

closeBlockStrings = [
    ")"
]

ScriptTag = "<script x=\"5\" y=\"5\">"  # this tag is for importing into snap
# BEGIN VARIABLES THAT CHANGE EVERY PARSING OF A STRING
currentParent = False

lastType = False
lastName = False
word=""
currentFunction=""
lastOverarchingType = False  # these two are for the ifThen/ifElse,Repeat blocks that have an overarching script tag in them.
lastOverarchingName = False  # these reset on newlines
overarchingNames = ["repeat", "forever", "ifThen", "ifThenElse", "repeatUntil"]

closeBlockWithScript = False  # should, when closing a script (mainly because of an indent), we also put in a closing block tag

result = ""  # This is the XML that snap processes
# END VARIABLES THAT CHANGE EVERY PARSING OF A STRING

def isParentTag(tag):
    """Return: True if a tag is a parent tag else false"""
    try:
        blocks.snapNames[tag]
        return 1
    except KeyError:
        try:
            blocks.abriviations[tag]
            return 2
        except KeyError:
            return 0

def isFunction(parent, string):
    global currentFunction, word
    try:
        blocks.snapNames[parent][string]
        return 3
    except KeyError:
        1*1
    try:
        blocks.snapNames[parent][word+string]
        word += string
        return 2
    except KeyError:
        1*1
    try:


        for func in blocks.snapNames[parent]:
            if func.find(word+string) != -1:
                word += string
                print word
                currentFunction = func
                return 1
    except KeyError:
        return 0

def doCloseSelf(snapName):
    """ returns / if a block should close itself and an empty string otherwise """

    if snapName in blocks.closeSelf:
        return "/"
    else:
        return ""


"""
this adds the syntax needed to declare a block to the result string
return None
"""



def buildBlock(type=False, name=False):
    global result, lastName, lastType, closeBlockWithScript

    if re.search("^( |	)*$", name) == None: # if it is not only whitespace or nothing

        if type == "NAME" and not (lastType == "Data" and lastName == "set"):
            result += "<block var=\""+name+"\" />"

        elif type == "STRING" or type=="NUMBER" or type == "NAME":
            result += "<l>"+name+"</l>"

        else:
            print type, name
            snapName = blocks.snapNames[type][name]

            if snapName in blocks.startChunkBlocks: # if this starts a chunk of connected blocks
                result += ScriptTag

            result += "<block s=\""+snapName+"\""+doCloseSelf(snapName)+">"
            lastName = name
            lastType = type




"""
Might be used in future updates
def closeBlock():
    global result
    result += "</block>\n"""""


def parseToken(typeNum, string, startRowAndCol, endRowAndCol, lineNum):
    """
    "ENDMARKER",  Not used
    """
    global currentParent, result, lastOverarchingType, lastOverarchingName, closeBlockWithScript, currentFunction, word

    string = string.lower()

    type = tokenTypes[int(typeNum)]
    print type
    if type == "NAME" and isParentTag(string) == 1 and currentParent == False:  # this defines a parent, so the next thing after the dot is a function
        currentParent = string
        print "parent"
        print currentParent
    elif type == "NAME" and isParentTag(string) == 2 and currentParent == False:  # this defines a parent, so the next thing after the dot is a function
        currentParent = blocks.abriviations[string]
        print "parent abrv"
        print currentParent
    elif type == "OP" and string == "." and currentParent:  # you don't matter, the function after you does
        return
    elif type == "NAME" and currentParent != False:  # this is a function
        isfunc = isFunction(currentParent,string)
        print isfunc
        print word
        print currentParent
        if isfunc == 3:
            print "building 3"
            print string
            print currentParent
            buildBlock(type=currentParent, name=string)
            currentParent = False
        elif isfunc == 2:

            print "building 2"
            print word
            print currentParent
            buildBlock(type=currentParent, name=word)

            word=""
            currentFunction =""
            currentParent = False


    elif type == "ENDMARKER":
        return
    elif type == "INDENT":
        return
    elif type == "DEDENT":  # the chunk of blocks has ended. Make a script tag
        result += "</script>"

        if closeBlockWithScript:
            result += "</block>"
            closeBlockWithScript = False

    elif type == "NEWLINE":
        lastOverarchingName = False
        lastOverarchingType = False

    elif string == ":":  # if there is a colon we either need a new script block or don't
        if lastOverarchingType == "Control" and lastOverarchingName in overarchingNames:
            result += "<script>"
            closeBlockWithScript = True

    elif string in closeBlockStrings and ( lastName not in overarchingNames ):
        result += "</block>\n"

    elif string in closeBlockStrings and lastName in overarchingNames:
        print "an unneeded statement just ran"
    elif string in ignoreStrings:
        print "an unneeded statement just ran"

    else:  # just a general input
        print type
        print string
        buildBlock(type=type, name=string)

    if lastType == "Control" and string in overarchingNames:  # seperate from the if/else loop, check if we should record that this is an overarching name
        lastOverarchingName = string
        lastOverarchingType = lastType


def translate(string):
    """Translate a string of an Etch file into Snap! XML. This does not return anything.
    Instead, when it is done executing, look at tokenizer.result."""
    global currentParent, lastType, lastName, result

    # Reset what needs to be reset
    currentParent = False
    lastType = False
    lastName = False
    result = ""

    fileObj = StringIO.StringIO(string)
    tokenize.tokenize(fileObj.readline, parseToken)
    print result
    currentParent = False

    lastType = False
    lastName = False
    word=""
    currentFunction=""
    lastOverarchingType = False  # these two are for the ifThen/ifElse,Repeat blocks that have an overarching script tag in them.
    lastOverarchingName = False  # these reset on newlines
    overarchingNames = ["repeat", "forever", "ifThen", "ifThenElse", "repeatUntil"]

    closeBlockWithScript = False  # should, when closing a script (mainly because of an indent), we also put in a closing block tag

    return result



