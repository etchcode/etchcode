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
        "move": {"snap":"forward", "inputs": [["integer", False]]},
        "turnright": {"snap": "turn", "inputs": [["integer", True]]},
        "turnleft": {"snap": "turnleft", "inputs": [["integer", True]]},
        "pointdirection": {"snap": "setHeading", "inputs": [["integer", True]]},
        "pointtowards": {"snap": "doFaceTowards", "inputs": [["sprite", True]]},
        "gotoxy": {"snap": "gotoXY", "inputs": [["integer", True]]},
        "gotoobject": {"snap": "doGotoObject", "inputs": [["sprite", True]]},
        "glide": {"snap": "doGlide", "inputs": [["integer", True]]},
        "changex": {"snap": "changeXPosition", "inputs": [["integer", True]]},
        "setx": {"snap": "setXPosition", "inputs": [["integer", True]]},
        "changey": {"snap": "changeYPosition", "inputs": [["integer", True]]},
        "sety": {"snap": "setYPosition", "inputs": [["integer", True]]},
        "ifedgebounce": {"snap": "bounceOffEdge", "inputs": [["integer", True]]},
        "xpos": {"snap": "xPosition", "inputs": [["integer", True]]},
        "ypos": {"snap": "yPosition", "inputs": [["integer", True]]},
        "direction": {"snap": "direction", "inputs": [["integer", True]]}
    },

    "looks": {
        # backdropName and switchBackdropTo are not in Snap!, so we can't support them
        "timedsay": {"snap": "doSayFor", "inputs": [["integer", True]]},
        "say": {"snap": "bubble", "inputs": [["string", True]]},
        "timedthink": {"snap": "doThinkFor", "inputs": [["integer", True]]},
        "think": {"snap":"doThink", "inputs":[["string", False]]},
        "show": {"snap": "show", "inputs": [["integer", True]]},
        "hide": {"snap": "hide", "inputs": [["integer", True]]},
        "switchcostumeto": {"snap": "doSwitchToCostume", "inputs": [["sprite", True]]},
        "nextcostume": {"snap": "doWearNextCostume", "inputs": [["integer", True]]},
        "changeeffect": {"snap": "changeEffect", "inputs": [["integer", True]]},
        "seteffect": {"snap": "setEffect", "inputs": [["integer", True]]},
        "cleargraphiceffects": {"snap": "clearEffects", "inputs": [["integer", True]]},
        "changesizeby": {"snap": "changeScale", "inputs": [["integer", True]]},
        "setsizeto": {"snap": "setScale", "inputs": [["integer", True]]},
        "gotofront": {"snap": "comeToFront", "inputs": [["integer", True]]},
        "gobacklayers": {"snap": "goBack", "inputs": [["integer", True]]},
        "costumenumber": {"snap": "getCostumeIdx", "inputs": [["integer", True]]},
        "size": {"snap": "getScale", "inputs": [["integer", True]]}
    },

    "sound": {
        # playDrum, changeVolumeBy, setVolumeTo, volume, and setInstrumentTo are not in Snap!, so we can't support it
        "playsound": {"snap": "playSound", "inputs": [["integer", True]]},
        "playsounduntildone": {"snap":"doPlaySoundUntilDone", "inputs": [["integer", True]]},
        "stopallsounds": {"snap": "doStopAllSounds", "inputs": [["integer", True]]},
        "restfor": {"snap": "doRest", "inputs": [["integer", True]]},
        "playnote": {"snap": "doPlayNote", "inputs": [["integer", True]]},
        "changetempoby": {"snap": "doChangeTempo", "inputs": [["integer", True]]},
        "settempoto": {"snap": "doSetTempo", "inputs": [["integer", True]]},
        "tempo": {"snap": "getTempo", "inputs": [["integer", True]]}
    },

    "pen": {
        "clear": {"snap": "clear", "inputs": [["integer", True]]},
        "stamp": {"snap": "doStamp", "inputs": [["integer", True]]},
        "pendown": {"snap": "down", "inputs": [["integer", True]]},
        "penup": {"snap": "up", "inputs": [["integer", True]]},
        "setpencolorto": {"snap": "setColor", "inputs": [["integer", True]]},
        "changepencolorby": {"snap": "changeHue", "inputs": [["integer", True]]},
        "setpencolortonumber": {"snap": "setHue", "inputs": [["integer", True]]},
        "changepenshadeby": {"snap": "changeBrightness", "inputs": [["integer", True]]},
        "changepensizeby": {"snap": "setSize", "inputs": [["integer", True]]},
        "setpensizeto": {"snap": "changeSize", "inputs": [["integer", True]]}
    },

    "data": {
        "set": {"snap": "doSetVar", "inputs": [["integer", True]]},
        "changeby": {"snap": "doChangeVar", "inputs": [["integer", True]]},
        "showvariable": {"snap": "doShowVar", "inputs": [["integer", True]]},
        "hidevariable": {"snap": "doHideVar", "inputs": [["integer", True]]}
    },

    "events": {
        #we can't support backdropswichesto, and greaterthan because Snap! doesn't
        "flagclicked": {"snap": "receiveGo", "inputs": [["integer", True]]},
        "keypressed": {"snap": "receiveKey", "inputs": [["integer", True]]},
        "thisspriteclicked": {"snap": "receiveInteraction", "inputs": [["integer", True]]},
        "ireceivemessage": {"snap": "receiveMessage", "inputs": [["integer", True]]},
        "broadcast": {"snap": "doBroadcast", "inputs": [["integer", True]]},
        "broadcastandwait": {"snap": "doBroadcastAndWait", "inputs": [["integer", True]]}
    },

    "control": {
        # ifThenElse is unsupported due to difficulty in implementation
        "wait":{"snap": "doWait", "inputs": [["integer", True]]} ,
        "repeat": {"snap": "doRepeat", "inputs": [["integer", True]]},
        "forever":{"snap": "doForever", "inputs": [["integer", True]]} ,
        "if": {"snap": "doIf", "inputs": [["integer", True]]},
        "waituntil": {"snap": "doWaitUntil", "inputs": [["integer", True]]},
        "repeatuntil": {"snap": "doUntil", "inputs": [["integer", True]]},
        "stopThis": {"snap": "doStopThis", "inputs": [["integer", True]]},
        "stopOthers": {"snap": "doStopOthers", "inputs": [["integer", True]]},
        "whenistartasaclone": {"snap": "receiveOnClone", "inputs": [["integer", True]]},
        "createcloneof": {"snap": "createClone", "inputs": [["integer", True]]},
        "deletethisclone": {"snap": "removeClone", "inputs": [["integer", True]]}
    },

    "sensing": {
        # we can't support loudness, turnvideo, setvideotransparencyto, xpositionof, dayssince2000, username, and videon because Snap! doesn't support them
        "touchingitem": {"snap": "reportTouchingObject", "inputs": [["integer", True]]},
        "touchingcolor": {"snap": "reportTouchingColor", "inputs": [["integer", True]]},
        "colorstouching": {"snap": "reportColorIsTouchingColor", "inputs": [["integer", True]]},
        "distanceto": {"snap": "reportDistanceTo", "inputs": [["integer", True]]},
        "askandwait": {"snap": "doAsk", "inputs": [["integer", True]]},
        "answer": {"snap": "getLastAnswer", "inputs": [["integer", True]]},
        "iskeypressed": {"snap": "reportKeyPressed", "inputs": [["integer", True]]},
        "ismousedown": {"snap": "reportMouseDown", "inputs": [["integer", True]]},
        "mousex": {"snap": "reportMouseX", "inputs": [["integer", True]]},
        "mousey": {"snap": "reportMouseY", "inputs": [["integer", True]]},
        "timer": {"snap": "getTimer", "inputs": [["integer", True]]},
        "resettimer": {"snap": "doResetTimer", "inputs": [["integer", True]]},
        "current": {"snap": "reportDate", "inputs": [["integer", True]]}
    },

    "operators": {
        "+": "reportSum",
        "-": "reportDifference",
        "*": "reportProduct",
        "/": "reportQuotient",
        "pickrandombetween": {"snap": "reportRandom", "inputs": [["integer", True]]},
        "<": "reportLessThan",
        "=": "reportEquals",
        ">": "reportGreaterThan",
        "and": "reportAnd",
        "or": "reportOr",
        "not": "reportNot",
        "join": "reportJoinWords",
        "letternumber": {"snap": "reportLetter", "inputs": [["integer", True]]},
        "lengthof": {"snap": "reportStringSize", "inputs": [["integer", True]]},
        "%": "reportModulus",
        "round": {"snap": "reportRound", "inputs": [["integer", True]]},
        "operationofnumber": {"snap": "reportMonadic", "inputs": [["integer", True]]}
    },

}

closeSelf = ["receiveGo", "xPosition", "yPosition", "direction"]  # tags that should self-close