__author__ = 'samschickler'
abriviations = {  # these reference other blocks form abriviation:block name that it is referenceing
                  "m": "motion",
                  "s": "sensing",
                  "d": "data",
                  "l": "looks",
                  "p": "pen",
                  "e": "events",
                  "c": "control",
                  "o": "operators",
}
snapNames = {

    "motion": {
        # setRotationStyle is not in Snap!, so I can't support it
        "move": "forward",
        "turnright": "turn",
        "turnleft": "turnLeft",
        "pointdirection": "setHeading",
        "pointtowards": "doFaceTowards",
        "gotoxy": "gotoXY",
        "gotoobject": "doGotoObject",
        "glide": "doGlide",
        "changex": "changeXPosition",
        "setx": "setXPosition",
        "changey": "changeYPosition",
        "sety": "setYPosition",
        "ifedgebounce": "bounceOffEdge",
        "xpos": "xPosition",
        "ypos": "yPosition",
        "direction": "direction"
    },

    "looks": {
        # backdropName and switchBackdropTo are not in Snap!, so we can't support them
        "timedsay": "doSayFor",
        "say": "bubble",
        "timedthink": "doThinkFor",
        "think": "doThink",
        "show": "show",
        "hide": "hide",
        "switchcostumeto": "doSwitchToCostume",
        "nextcostume": "doWearNextCostume",
        "changeeffect": "changeEffect",
        "seteffect": "setEffect",
        "cleargraphiceffects": "clearEffects",
        "changesizeby": "changeScale",
        "setsizeto": "setScale",
        "gotofront": "comeToFront",
        "gobacklayers": "goBack",
        "costumenumber": "getCostumeIdx",
        "size": "getScale"
    },

    "sound": {
        # playDrum, changeVolumeBy, setVolumeTo, volume, and setInstrumentTo are not in Snap!, so we can't support it
        "playsound": "playSound",
        "playsounduntildone": "doPlaySoundUntilDone",
        "stopallsounds": "doStopAllSounds",
        "restfor": "doRest",
        "playnote": "doPlayNote",
        "changetempoby": "doChangeTempo",
        "settempoto": "doSetTempo",
        "tempo": "getTempo"
    },

    "pen": {
        "clear": "clear",
        "stamp": "doStamp",
        "pendown": "down",
        "penup": "up",
        "setpencolorto": "setColor",
        "changepencolorby": "changeHue",
        "setpencolortonumber": "setHue",
        "changepenshadeby": "changeBrightness",
        "changepensizeby": "setSize",
        "setpensizeto": "changeSize"
    },

    "data": {
        "set": "doSetVar",
        "changeby": "doChangeVar",
        "showvariable": "doShowVar",
        "hidevariable": "doHideVar"
    },

    "events": {
        #we can't support backdropswichesto, and greaterthan because Snap! doesn't
        "flagclicked": "receiveGo",
        "keypressed": "receiveKey",
        "thisspriteclicked": "receiveInteraction",
        "ireceivemessage": "receiveMessage",
        "broadcast": "doBroadcast",
        "broadcastandwait": "doBroadcastAndWait"
    },

    "control": {
        # ifThenElse is unsupported due to difficulty in implementation
        "waitseconds": "doWait",
        "repeat": "doRepeat",
        "forever": "doForever",
        "if": "doIf",
        "waituntil": "doWaitUntil",
        "repeatuntil": "doUntil",
        "stopThis": "doStopThis",
        "stopOthers": "doStopOthers",
        "whenistartasaclone": "receiveOnClone",
        "createcloneof": "createClone",
        "deletethisclone": "removeClone",
        "whenflagclicked":"flagclicked"
    },

    "sensing": {
        # we can't support loudness, turnvideo, setvideotransparencyto, xpositionof, dayssince2000, username, and videon because Snap! doesn't support them
        "touchingitem": "reportTouchingObject",
        "touchingcolor": "reportTouchingColor",
        "colorstouching": "reportColorIsTouchingColor",
        "distanceto": "reportDistanceTo",
        "askandwait": "doAsk",
        "answer": "getLastAnswer",
        "iskeypressed": "reportKeyPressed",
        "ismousedown": "reportMouseDown",
        "mousex": "reportMouseX",
        "mousey": "reportMouseY",
        "timer": "getTimer",
        "resettimer": "doResetTimer",
        "current": "reportDate"
    },

    "operators": {
        "+": "reportSum",
        "-": "reportDifference",
        "*": "reportProduct",
        "/": "reportQuotient",
        "pickrandombetween": "reportRandom",
        "lessthan": "reportLessThan",
        "equal": "reportEquals",
        "greaterthan": "reportGreaterThan",
        "and": "reportAnd",
        "or": "reportOr",
        "not": "reportNot",
        "join": "reportJoinWords",
        "letternumber": "reportLetter",
        "lengthof": "reportStringSize",
        "%": "reportModulus",
        "round": "reportRound",
        "operationofnumber": "reportMonadic"
    },

}
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
def parentMaker(lists):
    if isParentTag(lists[0])== 1 or isParentTag(lists[0])== 2:
        if isParentTag(lists[0])== 2:
            lists[0] = abriviations[lists[0]]
        try:
            snapNames[lists[0]][lists[1].lower()]
            return [lists[0],lists[1]]
        except KeyError:
            if len(lists) > 2:
                g=""
                for j in lists:
                    if j == lists[0]:
                        print ""
                    elif j == ".":
                        print ""
                    else:
                        g += j
                        try:
                            snapNames[lists[0]][g.lower()]
                            return [lists[0].lower(),g.lower()]
                        except KeyError:
                            return 0
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
        print "ran d1"
        while True:
            try:
                lists.pop(lists.index("."))
            except ValueError:
                break
        if len(lists) > 3:
            for x in lists:
                a += 1

                if isParentTag(x):
                    parent = True
                    print x
                if parent:
                    print x
                    parlist.append(x)
                print parent
                print x
                print a
                print len(lists)
                print x == "+" or x == "-" or x == "*" or x == "/" or len(lists)==a
                if (x == "+" or x == "-" or x == "*" or x == "/" or len(lists)==a) and parent == True:

                    print "parlist"
                    print parlist
                    print inList
                    lists.insert(2, parentMaker(parlist))
                    parent = False
                    parlist = []

        return lists[:-2]
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
            print inlist

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
    if len(lists) == 1:
        try:
            l = float(lists[0])
            return "<l>"+lists[0]+"</l>"
        except ValueError:
            return '''<block var="'''+lists[0]+'''"/>'''
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
def main():

    g = parListMaker(["2","+","m",".","xpos"])
    print "g"
    print g
    print parenParser(g)

if __name__ == '__main__':
    main()