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
    """
    "sound": {
        "playSound": "",
        "playSoundUntilDone": "",
        "stopAllSounds": "",
        "playDrum": "",
        "restFor": "",
        "playNote": "",
        "setInstrumentTo": "",
        "changeVolumeBy": "",
        "setVolumeTo": "",
        "volume": "",
        "changeTempoBy": "",
        "setTempoTo": "",
        "tempo": ""
    },"""

    "pen": {
        "clear": "",
        "stamp": "",
        "penDown": "",
        "penUp": "",
        "setPenColorTo": "",
        "changePenColorBy": "",
        "setPenColorToNumber": "",
        "changePenShadeBy": "",
        "changePenSizeBy": "",
        "setPenSizeTo": ""
    },

    "data": {
        "set": "doSetVar",
        "changeBy": "",
        "showvariable": "",
        "hidevariable": ""
    },

    "events": {
        "flagclicked": "receiveGo",
        "keypressed": "",
        "thisspriteclicked": "",
        "backdropswitchesTo": "",
        "greaterthan": "",
        "ireceivemessage": "",
        "broadcast": "",
        "broadcastAndWait": ""
    },

    "control": {
        "waitSeconds": "",
        "repeat": "",
        "forever": "",
        "ifThen": "doIf",
        "ifThenElse": "",
        "waitUntil": "",
        "repeatUntil": "",
        "stop": "",
        "whenIStartAsAClone": "",
        "createCloneOf": "",
        "deleteThisClone": "",
    },

    "sensing": {
        "touchingItem": "",
        "touchingcolor": "reportTouchingColor",
        "colorsTouching": "",
        "distanceTo": "",
        "askAndWait": "",
        "answer": "",
        "isKeyPressed": "",
        "isMouseDown": "",
        "mouseX": "",
        "mouseY": "",
        "loudness": "",
        "videoOn": "",
        "turnVideo": "",
        "setVideoTransparencyTo": "",
        "timer": "",
        "resetTimer": "",
        "xPositionOf": "",
        "current": "",
        "daysSince2000": "",
        "username": ""
    },

    "operators": {
        "plus": "",
        "minus": "",
        "times": "",
        "divide": "",
        "pickRandomBetween": "",
        "lessThan": "",
        "equal": "",
        "greaterThan": "",
        "and": "",
        "or": "",
        "not": "",
        "join": "",
        "letterNumber": "",
        "lengthOf": "",
        "mod": "",
        "round": "",
        "operationOfNumber": ""
    },

}

closeSelf = ["receiveGo", "xPosition", "yPosition", "direction"]  # tags that should self-close