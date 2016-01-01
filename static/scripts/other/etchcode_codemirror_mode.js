// See <http://codemirror.net/doc/manual.html#modeapi>
CodeMirror.defineMode("etchcode", function(cm_config, mode_config){
    var TOKEN_END = /:| |,|\\\(|\\\)/;
    var INT = /\d/;
    var STR = /'.*?'|".*?"/;
    var FUNC_START = /[A-z]/;
    var FUNC = /[\w-]/;

    var HAT_BLOCK = /flag clicked/;
    var CHUNK_STARTER_BLOCK = /if/;

    return {
        startState: function(){
            return {
                so_far: "",
                type: null
            };
        },
        token: function token_parser(stream, state) {
            stream.next();
            return null;
        }
    };
});
