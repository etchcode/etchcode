import tokenize
import StringIO
import re
import sys
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
    tag = tag.lower()
    try:
        snapNames[tag]
        return 1
    except KeyError:
        try:
            abriviations[tag]
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


def parentMaker(lists):
    print "parent Maker"
    print lists
    if isParentTag(lists[0])== 1 or isParentTag(lists[0])== 2:
        print True
        if isParentTag(lists[0])== 2:
            lists[0] = abriviations[lists[0]]
        try:
            snapNames[lists[0]][lists[1]]
            return [lists[0],lists[1]]
        except KeyError:
                g=""
                for j in lists:
                    if j == lists[0]:
                        print ""
                    else:
                        g += j
                        try:
                            print g
                            snapNames[lists[0]][g]
                            return [lists[0],g]
                        except KeyError:
                            print ""
    return lists
def parListMaker(lists):
    finalList = []
    inList = []

    while True:
        try:
            j = lists.index("(")
        except ValueError:
            print "stoppp \n"
            break
        parenCounter = 1
        lists.pop(j)
        x = j
        k = j
        print k

        while True:
            if lists[j] == ")":
                parenCounter -= 1
                print "-"
                print parenCounter
                if(parenCounter== 0):
                    lists.pop(j)
                    break
            if lists[j] == "(":

                parenCounter += 1
                print parenCounter
            print j
            print "j"
            inList.append(lists.pop(j))
        print "x inlist"
        print inList
        print x
        print lists
        lists.insert(x, parListMaker(inList))
        inlist = []
    l = ["/", "*"]
    g = 0
    print "starting list"
    print lists
    d = 0
    inList = []
    d += lists.count("/")
    d += lists.count("-")
    d += lists.count("+")
    d += lists.count("*")
    parent = False
    parlist = []
    a = 0
    if d == 1:

        return lists
    while g < 2:
        print l
        while True:#checks if there is stuff we need to transform
            parenCounter = 0
            j= 1000
            h = 1000
            testExcept = 0
            try:
                j = lists.index(l[0])
            except ValueError:
                 testExcept += 1
            try:
                h = lists.index(l[1])
            except ValueError:
                 testExcept += 1
            if testExcept == 2:
                print testExcept
                break

            if j<=h:
                j = j
            if h<=j:
                j = h
            print "j"
            print j
            x = j
            k = j
            while True:
                j -= 1
                print j

                if j < 0:
                    k = j
                    j+= 1
                    break
                if type(lists[j]) == list:
                    k = j
                    break
                if lists[j] in snapNames["operators"]:
                    k = j+1
                    break
            inList = []
            o = 0
            print inList
            while True:
                print "lists"

                print j
                try:
                    if type(lists[j]) == list:
                        print "lists"
                    elif lists[j] in snapNames["operators"] and o != 2:
                        o = 2
                    elif (lists[j] in snapNames["operators"]) or j == ")" or j == "(":
                        break
                except IndexError:
                    break
                inList.append(lists[j])
                lists.pop(j)
                print "inlist"
                print inList


            lists.insert(j, inList)
            d += lists.count("/")
            d += lists.count("-")
            d += lists.count("+")
            d += lists.count("*")
            if d == 1:


                return lists
        g += 1
        l = ["+", "-"]

    return lists

def parenParser(lists): #this function builds the block out of the parsed list
    #input parsed list output:xml for the list
    print "start of paren parser"
    if len(lists) == 1:
        if type(lists[0]) == list and len(lists[0]) != 2:
            return parenParser(lists[0])
    a = 0
    parList = []

    parent = False
    if len(lists) > 3:
        print "ran thing"
        for x in lists:
            a += 1
            if type(x) != list:
                if isParentTag(x):
                    parent = True
                    print x
                if parent and x != ".":
                    print x
                    print "appended"
                    parList.append(x)
                print parent
                print x
                print a
                print len(lists)
                print x == "+" or x == "-" or x == "*" or x == "/" or len(lists)==a
                if len(lists)==a and parent == True:
                    print "parlist"
                    print parList

                    lists.insert(2, parentMaker(parList))
                    lists.pop(a-1)
                    lists.pop(a-1)

                    parent = False
                    parList = []

                if (x == "+" or x == "-" or x == "*" or x == "/") and parent == True:
                    a == 0
                    print "parlist"
                    print parList

                    lists.insert(0, parentMaker(parList))
                    parent = False
                    parList = []

    elif len(lists) == 1:
        try:
            l = float(lists[0])
            return "<l>"+lists[0]+"</l>"
        except ValueError:
            return '''<block var="'''+lists[0]+'''"/>'''
    global snapNames
    print lists
    parenResult = "\n"
    parenResult += "<block s=\""+snapNames["operators"][lists[1]]+"\""+">" #adds the opperator function


    for j in lists:
        print j
        if type(j) is list:
            if len(j) == 2: #adds if it is  a snap block
                print j
                try:
                    parenResult += "<block s=\""+snapNames[j[0]][j[1]]+"\""+"/>"
                except KeyError:
                    print "ERROR"
            else:
                print "list"
                parenResult += parenParser(j)       #if there is  equation inside of a equation
        elif j == lists[1]:
            print ""
        else:
            try:
                float(j)                    # if it is a number
                parenResult += "<l>"+str(j)+"</l>"
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




def parseToken(typeNum, string, startRowAndCol, endRowAndCol, lineNum):
    """
    "ENDMARKER",  Not used
    """
    global currentParent, result, parenCounter, lastOverarchingType, lastOverarchingName, closeBlockWithScript, currentFunction, childBuilderName

    string = string.lower()

    type = tokenTypes[int(typeNum)]
    print string
    print type
    if type == "COMMENT":
        result += ""
    elif type == "NAME" and isParentTag(string) == 1 and currentParent == False and parenCounter <2:  # this defines a parent, so the next thing after the dot is a function
        currentParent = string
        print "parent"
        print currentParent
    elif type == "NAME" and isParentTag(string) == 2 and currentParent == False and parenCounter < 2:  # this defines a parent, so the next thing after the dot is a function
        currentParent = blocks.abriviations[string]
        print "parent abrv"
        print currentParent
    elif type == "OP" and string == "." and currentParent:  # you don't matter, the function after you does
        return
    elif string == ":":
        if currentParent == True:
            childBuilderName=""
            currentFunction =""
            currentParent = False
        else:
            childBuilderName=""
            currentFunction =""
            currentParent = False
            print "Unreconized Function", sys.exc_info()[0]
            raise
    elif type == "OP" and string == "(":
        print "("
        if currentParent == True:
            childBuilderName=""
            currentFunction =""
            currentParent = False
            parenCounter += 1
        elif parenCounter >1:
            print ""
        else:
            childBuilderName=""
            currentFunction =""
            currentParent = False
            print "Unreconized Function", sys.exc_info()[0]
            raise

    elif type == "OP" and string == ")":
        print ")"
        parenCounter -= 1
        if parenCounter == 1:
            f = parListMaker(parenList)
            print "Parenlist parsed"
            print f
            result += parenParser(f)
        if parenCounter == 0:
            result += "</block"

    elif parenCounter > 1:
        parenList.append(string)
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



    elif type == "ENDMARKER":
        return
    elif type == "OP":
        print ""
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


