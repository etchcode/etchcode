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
    ",",
    "."
]

closeBlockStrings = [
    ")"
]

ScriptTag = "<script x=\"5\" y=\"5\">"  # this tag is for importing into snap
abriviations = blocks.abriviations
snapNames = blocks.snapNames
# BEGIN VARIABLES THAT CHANGE EVERY PARSING OF A STRING
currentParent = False
parenCounter = 0
parenList = []
lastType = False
lastName = False
childBuilderName= ""
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
    global currentFunction, childBuilderName
    try:
        blocks.snapNames[parent][string]
        return 3
    except KeyError:
        1*1
    try:
        blocks.snapNames[parent][childBuilderName+string]
        childBuilderName += string
        return 2
    except KeyError:
        1*1
    try:


        for func in blocks.snapNames[parent]:
            if func.find(childBuilderName+string) != -1:
                childBuilderName += string
                print childBuilderName
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

def parListMaker(lists):
    finalList = []
    inList = []
    nameList =""
    par = False
    parin = 0
    parent = False
    for j in lists:
        print j
        print parin
        print parent
        if type(j) != list:
            if isParentTag(j.lower()) == 1:   # checks if parent tag
                print "parent"
                parent = j.lower()
            elif isParentTag(j.lower()) == 2:
                print "parent abv"
                parent = abriviations[j.lower()]
            elif parent and not (j in snapNames["operators"]):
                print "not op"
                nameList += j.lower()
            elif parent != False and j in snapNames["operators"] and len(nameList)>0:
                print "op"
                if parin > 0:
                    inList.append([parent, nameList])
                else:
                    finalList.append([parent, nameList])
                parent = False
                nameList = ""
            elif parent != False and j == "(" or j == ")" and len(nameList)>0:
                print "paren"
                print nameList
                if parin > 0:
                    inList.append([parent, nameList])
                else:
                    finalList.append([parent, nameList])
                parent = False
                nameList = ""
        if not parent:
            print "not parent"
            if j == "(":

                parin += 1
                par = True
                if parin != 1:
                    print "start"
                    inList.append("(")
            elif j == ")":
                parin -= 1

                if parin != 0:
                    print "end"
                    inList.append(")")
            elif parin >0:
                print "add"
                inList.append(j)
            else:
                print "else"
                finalList.append(j)
            if parin == 0 and par:
                par = False
                print "new"
                print inList
                finalList.append(parListMaker(inList))
    return finalList
def parenParser(lists): #this function builds the block out of the parsed list
    #input parsed list output:xml for the list
    print "start of paren parser"
    global snapNames
    parenResult = "\n"
    parenResult += "<block s=\""+snapNames["operators"][lists[1]]+"\""+">" #adds the opperator function


    for j in lists:
        print j
        if len(j) == 2 and type(j) is list: #adds if it is  a snap block
            print j
            try:
                parenResult += "<block s=\""+snapNames[j[0]][j[1]]+"\""+"/>"
            except KeyError:
                print "ERROR"
        elif type(j) is list:
            print "list"
            parenResult += parenParser(j)       #if there is  equation inside of a equation
        elif j == lists[1]:
            print ""
        else:
            try:
                float(j)                    # if it is a number
                parenResult += "<l>"+j+"</l>"
                print "did work"
            except ValueError:
                print "didn't work"         # if it is  a variable
                parenResult+="<block var=\""+j+"\" />"


    parenResult += "</block>"
    return parenResult
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
def parenParser(lists):
    global snapName
    parenResult = ""
    parenResult += "<block s=\""+snapName["operators"][lists[2]]+"\""+">"


    for j in lists:
        if j is list:
             d = parenParser(j)
        if j is str:
            parenResult += "<l>"+j+"</l>"

    parenResult += "</block>"
    return parenResult



def parseToken(typeNum, string, startRowAndCol, endRowAndCol, lineNum):
    """
    "ENDMARKER",  Not used
    """
    global currentParent, result, parenCounter, lastOverarchingType, lastOverarchingName, closeBlockWithScript, currentFunction, childBuilderName

    string = string.lower()

    type = tokenTypes[int(typeNum)]
    print string
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
    elif type == "OP" and string == "(":
        print "("
        parenCounter += 1
    elif type == "OP" and string == ")":
        print ")"
        parenCounter -= 1
        if parenCounter == 0:
            parenParser()
    elif type == "NAME" and currentParent != False:  # this is a function
        isfunc = isFunction(currentParent,string)
        print isfunc
        print childBuilderName
        print currentParent
        if isfunc == 3:
            print "building 3"
            print string
            print currentParent
            buildBlock(type=currentParent, name=string)
            currentParent = False
        elif isfunc == 2:

            print "building 2"
            print childBuilderName
            print currentParent
            buildBlock(type=currentParent, name=childBuilderName)

            childBuilderName=""
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

    if lastType == "Control" and string in overarchingNames:  #seperate from the if/else loop, check if we should record that this is an overarching name
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



