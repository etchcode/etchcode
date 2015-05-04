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
                  "goy": "changey",
                  "gox": "changex",
                  "clearEffects": "cleargraphiceffects",
                  "whenflagclicked":"flaglicked"
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
        "deletethisclone": "removeClone"
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
    try:
        snapNames[tag]
        return 1
    except KeyError:
        try:
            abriviations[tag]
            return 2
        except KeyError:
            return 0
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
def main():

    g = parListMaker(["(", "m", "x", "pos", "/", "(", "hi", "+", "52", ")",")","+","6"])
    print "g"
    print g
    print parenParser(g)
if __name__ == '__main__':
    main()