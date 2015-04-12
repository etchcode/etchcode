var parentToken = "";
var childToken = "";
var thisToken = "parent";

var tokenEndCharacters = ["."];
var tokenGroupEndCharacters = [" ","(",")"];

var parentTokens = ["Motion", "Looks", "Sound", "Pen", "Data", "Events", "Control", "Sensing", "Operators"]
var childTokens = {'Sound': ['restFor', 'setVolumeTo', 'changeTempoBy', 'playDrum', 'tempo', 'volume', 'playSound', 'playSoundUntilDone', 'playNote', 'setTempoTo', 'setInstrumentTo', 'stopAllSounds', 'changeVolumeBy'], 'Control': ['waitSeconds', 'repeat', 'ifThenElse', 'stop', 'repeatUntil', 'forever', 'whenIStartAsAClone', 'deleteThisClone', 'waitUntil', 'createCloneOf', 'ifThen'], 'Data': ['set', 'hideVariable', 'showVariable', 'changeBy'], 'Operators': ['and', 'or', 'join', 'divide', 'lengthOf', 'equal', 'times', 'lessThan', 'pickRandomBetween', 'plus', 'operationOfNumber', 'letterNumber', 'not', 'greaterThan', 'minus', 'round', 'mod'], 'Motion': ['xPos', 'changeY', 'glide', 'pointDirection', 'turnLeft', 'move', 'direction', 'yPos', 'goToXY', 'turnRight', 'goToObject', 'pointTowards', 'changeX', 'ifEdgeBounce', 'setX', 'setY'], 'Pen': ['setPenColorTo', 'changePenColorBy', 'penDown', 'setPenSizeTo', 'changePenSizeBy', 'penUp', 'stamp', 'clear', 'setPenColorToNumber', 'changePenShadeBy'], 'Looks': ['setEffect', 'hide', 'clearGraphicEffects', 'show', 'goBackLayers', 'setSizeTo', 'switchCostumeTo', 'changeEffect', 'timedThink', 'say', 'nextCostume', 'timedSay', 'changeSizeBy', 'goToFront', 'costumeNumber', 'think', 'size'], 'Sensing': ['username', 'xPositionOf', 'setVideoTransparencyTo', 'resetTimer', 'distanceTo', 'colorsTouching', 'timer', 'askAndWait', 'current', 'touchingColor', 'touchingItem', 'mouseY', 'mouseX', 'loudness', 'answer', 'isKeyPressed', 'daysSince2000', 'videoOn', 'isMouseDown', 'turnVideo'], 'Events': ['broadcast', 'whenBackdropSwitchesTo', 'whenFlagClicked', 'whenGreaterThan', 'broadcastAndWait', 'whenKeyPressed', 'whenIReceiveMessage', 'whenThisSpriteClicked']}

onmessage = function(message){
	var type = message.data.type;
	
	if(type == "keyPress"){
		handleKeypress(message.data.letter);
	}
	else if(type == "clear"){
		childToken = "";
		parentToken = "";
		thisToken = "parent";
	}
}

function handleKeypress(letter){
	if(tokenEndCharacters.indexOf(letter) !== -1){ // this is a token end character
		if(thisToken == "parent"){ // now it is time to move on to the child
			thisToken = "child";
		}
		else if(thisToken == "child"){ // this is the end. Start again
			childToken = "";
			parentToken = "";
			thisToken = "parent";
		}
	}
	else if(tokenGroupEndCharacters.indexOf(letter) !== -1){ // this was a tokenGroupEnd character, this is the end. Start again.
		childToken = "";
		parentToken = "";
		thisToken = "parent";
	}
	else{ // Just an ordinary letter.
		if(thisToken == "child"){
			childToken += letter;
		}
		else if(thisToken == "parent"){
			parentToken += letter;
		}
	}
		
	postMessage(suggest()); // get the suggestion and send it back to our parent
}

function suggest(){
	
	if(thisToken == "parent"){
		var possibilitiesToCheck = parentTokens;
		var toLookFor = parentToken;
	}
	else if(thisToken == "child"){
		var possibilitiesToCheck = childTokens[parentToken];
		var toLookFor = childToken;
	}
	
	var matches = [];
	
	if(possibilitiesToCheck !== undefined){ // they didn't enter an invalid token before or do something else weird like that
		for(var i = 0; i < possibilitiesToCheck.length; i++){
			var token = possibilitiesToCheck[i];
			
			if(token.search(toLookFor) == 0){ // what we are looking for occurs at the beginning of this token
				matches.push(token);
			}
		}
	}
	
	return matches;
}