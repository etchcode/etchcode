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
        "turnright": {"snap": "turn", "inputs": [["integer", False]]},
        "turnleft": {"snap": "turnleft", "inputs": [["integer", False]]},
        "pointdirection": {"snap": "setHeading", "inputs": [["integer", False]]},
        "pointtowards": {"snap": "doFaceTowards", "inputs": [["sprite", True]]},
        "gotoxy": {"snap": "gotoXY", "inputs": [["integer", False], ["integer", False]]},
        "gotoobject": {"snap": "doGotoObject", "inputs": [["sprite", True]]},
        "glide": {"snap": "doGlide", "inputs": [["integer", False],["integer", False],["integer", False]]},
        "changex": {"snap": "changeXPosition", "inputs": [["integer", False]]},
        "setx": {"snap": "setXPosition", "inputs": [["integer", False]]},
        "changey": {"snap": "changeYPosition", "inputs": [["integer", False]]},
        "sety": {"snap": "setYPosition", "inputs": [["integer", False]]},
        "ifedgebounce": {"snap": "bounceOffEdge", "inputs": []},
        "xpos": {"snap": "xPosition", "inputs": []},
        "ypos": {"snap": "yPosition", "inputs": []},
        "direction": {"snap": "direction", "inputs": []}
    },

    "looks": {
        # backdropName and switchBackdropTo are not in Snap!, so we can't support them
        "timedsay": {"snap": "doSayFor", "inputs": [["string", False], ["integer", False]]},
        "say": {"snap": "bubble", "inputs": [["string", False]]},
        "timedthink": {"snap": "doThinkFor", "inputs": [["string", False], ["integer", False]]},
        "think": {"snap":"doThink", "inputs":[["string", False]]},
        "show": {"snap": "show", "inputs": []},
        "hide": {"snap": "hide", "inputs": []},
        "switchcostumeto": {"snap": "doSwitchToCostume", "inputs": [["sprite", True]]},
        "nextcostume": {"snap": "doWearNextCostume", "inputs": []},
        "changeeffect": {"snap": "changeEffect", "inputs": [["sprite", True], ["integer", False]]},
        "seteffect": {"snap": "setEffect", "inputs": [["sprite", True], ["integer", False]]},
        "cleargraphiceffects": {"snap": "clearEffects", "inputs": []},
        "changesizeby": {"snap": "changeScale", "inputs": [["integer", False]]},
        "setsizeto": {"snap": "setScale", "inputs": [["integer", False]]},
        "gotofront": {"snap": "comeToFront", "inputs": []},
        "gobacklayers": {"snap": "goBack", "inputs": [["integer", False]]},
        "costumenumber": {"snap": "getCostumeIdx", "inputs": []},
        "size": {"snap": "getScale", "inputs": []}
    },

    "sound": {
        # playDrum, changeVolumeBy, setVolumeTo, volume, and setInstrumentTo are not in Snap!, so we can't support it
        # "playsound": {"snap": "playSound", "inputs": [["integer", False]]},
        # "playsounduntildone": {"snap":"doPlaySoundUntilDone", "inputs": [["integer", False]]},
        "stopallsounds": {"snap": "doStopAllSounds", "inputs": []},
        "restfor": {"snap": "doRest", "inputs": [["integer", False], ["integer", False]]},
        "playnote": {"snap": "doPlayNote", "inputs": [["integer", False]]},
        "changetempoby": {"snap": "doChangeTempo", "inputs": [["integer", False]]},
        "settempoto": {"snap": "doSetTempo", "inputs": [["integer", False]]},
        "tempo": {"snap": "getTempo", "inputs": []}
    },

    "pen": {
        "clear": {"snap": "clear", "inputs": []},
        "stamp": {"snap": "doStamp", "inputs": []},
        "down": {"snap": "down", "inputs": []},
        "up": {"snap": "up", "inputs": []},
        # "setcolorto": {"snap": "setColor", "inputs": [["integer", False], ["integer", False], ["integer", False],["integer", False]]},
        "changecolorby": {"snap": "changeHue", "inputs": [["integer", False]]},
        "setcolortonumber": {"snap": "setHue", "inputs": [["integer", False]]},
        "changeshadeby": {"snap": "changeBrightness", "inputs": [["integer", False]]},
        "changesizeby": {"snap": "setSize", "inputs": [["integer", False]]},
        "setsizeto": {"snap": "changeSize", "inputs": [["integer", False]]}
    },

    "data": {
        "set": {"snap": "doSetVar", "inputs": [["sprite", True] ["integer", False]]},
        "changeby": {"snap": "doChangeVar", "inputs": [["sprite", True] ["integer", False]]},
        "showvariable": {"snap": "doShowVar", "inputs": [["sprite", True] ["integer", False]]},
        "hidevariable": {"snap": "doHideVar", "inputs": [["sprite", True] ["integer", False]]}
    },

    "events": {
        #we can't support backdropswichesto, and greaterthan because Snap! doesn't
        "flagclicked": {"snap": "receiveGo", "inputs": []},
        "keypressed": {"snap": "receiveKey", "inputs": [["key", True]]},
        "thisspriteclicked": {"snap": "receiveInteraction", "inputs": [["sprite", True]]},
        # "ireceivemessage": {"snap": "receiveMessage", "inputs": [["sprite", True]]},
        # "broadcast": {"snap": "doBroadcast", "inputs": [["integer", False]]},
        # "broadcastandwait": {"snap": "doBroadcastAndWait", "inputs": [["integer", False]]}
    },

    "control": {
        # ifThenElse is unsupported due to difficulty in implementation
        "wait":{"snap": "doWait", "inputs": [["integer", False]]} ,
        # "repeat": {"snap": "doRepeat", "inputs": [["integer", False]]},
        # "forever":{"snap": "doForever", "inputs": [["integer", False]]} ,
        # "if": {"snap": "doIf", "inputs": [["integer", False]]},
        # "waituntil": {"snap": "doWaitUntil", "inputs": [["integer", False]]},
        # "repeatuntil": {"snap": "doUntil", "inputs": [["integer", False]]},
        "stopThis": {"snap": "doStopThis", "inputs": [["snap value", True]]},
        "stopOthers": {"snap": "doStopOthers", "inputs": [["snap value", True]]},
        # "whenistartasaclone": {"snap": "receiveOnClone", "inputs": [["integer", False]]},
        "createcloneof": {"snap": "createClone", "inputs": [["sprite or me", True]]},
        "deletethisclone": {"snap": "removeClone", "inputs": []}
    },

    "sensing": {
        # we can't support loudness, turnvideo, setvideotransparencyto, xpositionof, dayssince2000, username, and videon because Snap! doesn't support them
        # "touching": {"snap": "reportTouchingObject", "inputs": [["integer", False]]},
        # "touchingcolor": {"snap": "reportTouchingColor", "inputs": [["integer", False]]},
        # "colorstouching": {"snap": "reportColorIsTouchingColor", "inputs": [["integer", False]]},
        # "distanceto": {"snap": "reportDistanceTo", "inputs": [["integer", False]]},
        "askandwait": {"snap": "doAsk", "inputs": [["string", False]]},
        "answer": {"snap": "getLastAnswer", "inputs": []},
        # "iskeypressed": {"snap": "reportKeyPressed", "inputs": [["integer", False]]},
        # "ismousedown": {"snap": "reportMouseDown", "inputs": [["integer", False]]},
        "mousex": {"snap": "reportMouseX", "inputs": []},
        "mousey": {"snap": "reportMouseY", "inputs": []},
        "timer": {"snap": "getTimer", "inputs": []},
        "resettimer": {"snap": "doResetTimer", "inputs": []},
        # "current": {"snap": "reportDate", "inputs": [["integer", False]]}
    },

    "operators": {
        "+": "reportSum",
        "-": "reportDifference",
        "*": "reportProduct",
        "/": "reportQuotient",
        # "pickrandombetween": {"snap": "reportRandom", "inputs": [["integer", False]]},
        # "<": "reportLessThan",
        # "=": "reportEquals",
        # ">": "reportGreaterThan",
        # "and": "reportAnd",
        # "or": "reportOr",
        # "not": "reportNot",
        # "join": "reportJoinWords",
        # "letternumber": {"snap": "reportLetter", "inputs": [["integer", False]]},
        # "lengthof": {"snap": "reportStringSize", "inputs": [["integer", False]]},
        "%": "reportModulus",
        # "round": {"snap": "reportRound", "inputs": [["integer", False]]},
        # "operationofnumber": {"snap": "reportMonadic", "inputs": [["integer", False]]}
    },

}

closeSelf = ["receiveGo", "xPosition", "yPosition", "direction"]  # tags that should self-close