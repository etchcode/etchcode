from flask import Flask, Response, request

import json

app = Flask("api")
app.config.from_pyfile("config.py")

@app.route("/api/blocks.json")
def blocks():
    """
    Take nothing
    :return: data on all the blocks.
    """

    #TODO: This should return docs on the blocks
    import parser.blocks

    return Response(json.dumps({
        "closeSelf": parser.blocks.closeSelf,
        "snapNames": parser.blocks.snapNames,
        "startChunkBlocks": parser.blocks.startChunkBlocks,
        "abbreviations": parser.blocks.abriviations
    }), content_type="application/json")

@app.route("/api/parse.json", methods=["POST"])
def parse():
    """Get: request paramater scripts with list of script object as generated by /editor that is json encoded
    Return: Parsed scripts
    """
    try:
        from parser import translator
        
        scripts = json.loads(json.loads(request.data.decode())["scripts"]) #don't use request.form because ng transmits data as json

        parsed = {}
        for name in scripts:
            parsed[name] = translator.translate(scripts[name]) # translate it

        return Response(json.dumps(parsed), content_type="application/json")
    
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), content_type="application/json", status="500")