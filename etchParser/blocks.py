startChunkBlocks = [  # blocks that start a chunk of connected blocks
                      "receiveGo",
]
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
        # setRotatioStyle is not in Snap!, so I can't support it
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
        "wait": "doWait",
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
        "<": "reportLessThan",
        "=": "reportEquals",
        ">": "reportGreaterThan",
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

closeSelf = ["receiveGo", "xPosition", "yPosition", "direction"]  # tags that should self-close