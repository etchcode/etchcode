var d;

(function (mod) {
    if (typeof exports == "object" && typeof module == "object") {// CommonJS
        mod(require("../../lib/codemirror"));
    }
    else if (typeof define == "function" && define.amd) {// AMD
        define(["../../lib/codemirror"], mod);
    }
    else { // Plain browser env
        mod(CodeMirror);
    }
})(function (CodeMirror) {
    "use strict";

    var currentKeyword = "SAd";
    var parentBol = false;

    var dictionary = {};
    var parent_abbreviation = [];
    var parents = [];
    var listOfChildren = [];
    fetch("/api/blocks.json").then(function(response) { // this uses the super-modern fetch api to get data on the blocks from the server
        return response.json(); // returns a promise that resolves to the json sent

    }).then(function(blocksData) {
        for (var parent in blocksData.snapNames) {
            if (blocksData.snapNames.hasOwnProperty(parent)) {
                var pAbbriv = parent[0];

                 // currently the children are listed as properties of the parent object. This will hold a list converted from the parent object
                for(var child in blocksData.snapNames[parent]) {
                    if(blocksData.snapNames[parent].hasOwnProperty(child)) {
                        listOfChildren.push(child);
                    }
                }

                dictionary[pAbbriv] = listOfChildren; // turn the dictionary of snapNames by parent into a dict by first letter of parent name
                parent_abbreviation.push(pAbbriv);
                parents.push(parent);
            }
        }

        // now we have to reset all the modes so that the changes will be updated
        var allTextAreas = document.getElementsByTagName("textarea");

        for(var i = 0; i < allTextAreas.length; i++){
            var textarea = allTextAreas[i];

            if(textarea.hasAttribute("ui-codemirror")){ // if the textarea is a codemirror
                var scope = angular.element(textarea).scope(); // get the scope of this textarea

                scope.$apply(function() {
                    scope.codemirrorConfig.mode = "tempDummyFakeMode"; // this is needed so that when the scope is set to etch below it will be a change
                }); // jshint ignore:line
                scope.$apply(function(){
                    scope.codemirrorConfig.mode = "etch"; // set the scope to etch again so that the mode will be reloaded
                }); // jshint ignore:line
            }
        }

        d = dictionary;
    });


    function top(state) {
        return state.scopes[state.scopes.length - 1];
    }

    CodeMirror.defineMode("etch", function (conf, parserConf) {

        var ERRORCLASS = "error";

        var singleDelimiters = parserConf.singleDelimiters || new RegExp("^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]");
        var singleOperators = parserConf.singleOperators || new RegExp("^[\\+\\-\\*/%&|\\^~<>!@]");
        var identifiers;
        if (parserConf.version && parseInt(parserConf.version, 10) == 3) {
            identifiers = parserConf.identifiers || new RegExp("^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*");
        } else {
            identifiers = parserConf.identifiers || new RegExp("^[_A-Za-z][_A-Za-z0-9]*");
        }

        var hangingIndent = parserConf.hangingIndent || conf.indentUnit;

        var myKeywords = parents;
        var stringPrefixes;
        if (parserConf.extra_keywords !== undefined) {
            myKeywords = myKeywords.concat(parserConf.extra_keywords);
        }
        if (parserConf.version && parseInt(parserConf.version, 10) == 3) {
            stringPrefixes = new RegExp("^(([rb]|(br))?('{3}|\"{3}|['\"]))", "i");
        } else {
            stringPrefixes = new RegExp("^(([rub]|(ur)|(br))?('{3}|\"{3}|['\"]))", "i");
        }
        var keywords = new RegExp(parents.join("|"), "i");
        var builtins = new RegExp(parent_abbreviation.join("|"), "i");

        // tokenizers
        function tokenBase(stream, state) {
            // Handle scope changes

            //        console.info("state: " + state);
            if (stream.sol() && top(state).type == "py") {
                var scopeOffset = top(state).offset;
                if (stream.eatSpace()) {
                    var lineOffset = stream.indentation();
                    if (lineOffset > scopeOffset)
                        pushScope(stream, state, "py");
                    else if (lineOffset < scopeOffset && dedent(stream, state))
                        state.errorToken = true;
                    return null;
                } else {
                    var style = tokenBaseInner(stream, state);
                    if (scopeOffset > 0 && dedent(stream, state))
                        style += " " + ERRORCLASS;
                    return style;
                }
            }
            return tokenBaseInner(stream, state);
        }

        function tokenBaseInner(stream, state) {

            //        var stream = streams.toLowerCase();
            if (stream.eatSpace()) return null;

            var ch = stream.peek();
            //        console.info("current: "+ stream);
            // Handle Comments
            if (ch == "#") {
                stream.skipToEnd();
                return "comment";
            }

            // Handle Number Literals
            if (stream.match(/^[0-9\.]/, false)) {
                var floatLiteral = false;
                // Floats
                if (stream.match(/^\d*\.\d+(e[\+\-]?\d+)?/i)) {
                    floatLiteral = true;
                }
                if (stream.match(/^\d+\.\d*/)) {
                    floatLiteral = true;
                }
                if (stream.match(/^\.\d+/)) {
                    floatLiteral = true;
                }
                if (floatLiteral) {
                    // Float literals may be "imaginary"
                    stream.eat(/J/i);
                    return "number";
                }
                // Integers
                var intLiteral = false;
                // Hex
                if (stream.match(/^0x[0-9a-f]+/i)) intLiteral = true;
                // Binary
                if (stream.match(/^0b[01]+/i)) intLiteral = true;
                // Octal
                if (stream.match(/^0o[0-7]+/i)) intLiteral = true;
                // Decimal
                if (stream.match(/^[1-9]\d*(e[\+\-]?\d+)?/)) {
                    // Decimal literals may be "imaginary"
                    stream.eat(/J/i);
                    // TODO - Can you have imaginary longs?
                    intLiteral = true;
                }
                // Zero by itself with no other piece of number.
                if (stream.match(/^0(?![\dx])/i)) intLiteral = true;
                if (intLiteral) {
                    // Integer literals may be "long"
                    stream.eat(/L/i);
                    return "number";
                }
            }

            // Handle Strings
            if (stream.match(stringPrefixes)) {
                state.tokenize = tokenStringFactory(stream.current());
                return state.tokenize(stream, state);
            }

            // Handle operators and Delimiters
            //      if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters))
            //        return null;
            //
            //      if (stream.match(doubleOperators) || stream.match(singleOperators))
            //        return "operator";

            if (stream.match(singleDelimiters))
                return null;
            if (stream.match(singleOperators))
                return null;
//            console.info("peek" +stream.peek());
            if (true) {

                
                var x = true;
                var j = 0;
                var strings = "";
//                console.info("peek" +stream.peek());

//                if(currentKeyword == "motion"){
//                strings = "m";
//                }
                while (x) {
                    if (stream.peek() === "(" || stream.peek() === undefined || stream.peek() === ":" || j > 30) {
                        x = false;
                    }
                    else {
                        //                console.info(stream.peek());
                        var g = stream.eat(new RegExp(".")).toLowerCase();
                        if (g != " ") {
                            strings = strings.concat(g);
//                            console.info(strings);
                        }//this combine the entire child
                    }
                    j++;
                }//while statement
                //
                //            console.info(currentKeyword);
                //            console.info(strings);
                //            console.info(dictionary[currentKeyword[0]]);

                    if (listOfChildren.indexOf(strings) != -1) {
                        return "builtin";
                    }
                }//end of child area
            if (stream.match(/^(self|cls)\b/))
                return "variable-2";

            if (stream.match(identifiers)) {
                if (state.lastToken == "def" || state.lastToken == "class")
                    return "def";
                return "variable";
            }

            // Handle non-detected items
            stream.next();
            return ERRORCLASS;
        }

        function tokenStringFactory(delimiter) {
            while ("rub".indexOf(delimiter.charAt(0).toLowerCase()) >= 0)
                delimiter = delimiter.substr(1);

            var singleline = delimiter.length == 1;
            var OUTCLASS = "string";

            function tokenString(stream, state) {
                while (!stream.eol()) {
                    stream.eatWhile(/[^'"\\]/);
                    if (stream.eat("\\")) {
                        stream.next();
                        if (singleline && stream.eol())
                            return OUTCLASS;
                    } else if (stream.match(delimiter)) {
                        state.tokenize = tokenBase;
                        return OUTCLASS;
                    } else {
                        stream.eat(/['"]/);
                    }
                }
                if (singleline) {
                    if (parserConf.singleLineStringErrors)
                        return ERRORCLASS;
                    else
                        state.tokenize = tokenBase;
                }
                return OUTCLASS;
            }

            tokenString.isString = true;
            return tokenString;
        }

        function pushScope(stream, state, type) {
            var offset = 0, align = null;
            if (type == "py") {
                while (top(state).type != "py")
                    state.scopes.pop();
            }
            offset = top(state).offset + (type == "py" ? conf.indentUnit : hangingIndent);
            if (type != "py" && !stream.match(/^(\s|#.*)*$/, false))
                align = stream.column() + 1;
            state.scopes.push({offset: offset, type: type, align: align});
        }

        function dedent(stream, state) {
            var indented = stream.indentation();
            while (top(state).offset > indented) {
                if (top(state).type != "py") return true;
                state.scopes.pop();
            }
            return top(state).offset != indented;
        }

        function tokenLexer(stream, state) {
            var style = state.tokenize(stream, state);
            var current = stream.current();

            // Handle '.' connected identifiers
            if (current == ".") {
                style = stream.match(identifiers, false) ? null : ERRORCLASS;
                if (style === null && state.lastStyle == "meta") {
                    // Apply 'meta' style to '.' connected identifiers when
                    // appropriate.
                    style = "meta";
                }
                return style;
            }

            // Handle decorators
            if (current == "@") {
                if (parserConf.version && parseInt(parserConf.version, 10) == 3) {
                    return stream.match(identifiers, false) ? "meta" : "operator";
                } else {
                    return stream.match(identifiers, false) ? "meta" : ERRORCLASS;
                }
            }

            if ((style == "variable" || style == "builtin") && state.lastStyle == "meta")
                style = "meta";

            // Handle scope changes.
            if (current == "pass" || current == "return")
                state.dedent += 1;

            if (current == "lambda") state.lambda = true;
            if (current == ":" && !state.lambda && top(state).type == "py")
                pushScope(stream, state, "py");

            var delimiter_index = current.length == 1 ? "[({".indexOf(current) : -1;
            if (delimiter_index != -1)
                pushScope(stream, state, "])}".slice(delimiter_index, delimiter_index + 1));

            delimiter_index = "])}".indexOf(current);
            if (delimiter_index != -1) {
                if (top(state).type == current) state.scopes.pop();
                else return ERRORCLASS;
            }
            if (state.dedent > 0 && stream.eol() && top(state).type == "py") {
                if (state.scopes.length > 1) state.scopes.pop();
                state.dedent -= 1;
            }

            return style;
        }

        var external = {
            startState: function (basecolumn) {
                return {
                    tokenize: tokenBase,
                    scopes: [{offset: basecolumn || 0, type: "py", align: null}],
                    lastStyle: null,
                    lastToken: null,
                    lambda: false,
                    dedent: 0
                };
            },

            token: function (stream, state) {
                var addErr = state.errorToken;
                if (addErr) state.errorToken = false;
                var style = tokenLexer(stream, state);

                state.lastStyle = style;

                var current = stream.current();
                if (current && style)
                    state.lastToken = current;

                if (stream.eol() && state.lambda)
                    state.lambda = false;
                return addErr ? style + " " + ERRORCLASS : style;
            },

            indent: function (state, textAfter) {
                if (state.tokenize != tokenBase)
                    return state.tokenize.isString ? CodeMirror.Pass : 0;

                var scope = top(state);
                var closing = textAfter && textAfter.charAt(0) == scope.type;
                if (scope.align !== null)
                    return scope.align - (closing ? 1 : 0);
                else if (closing && state.scopes.length > 1)
                    return state.scopes[state.scopes.length - 2].offset;
                else
                    return scope.offset;
            },

            closeBrackets: {triples: "'\""},
            lineComment: "#",
            fold: "indent"
        };
        return external;
    });
});

