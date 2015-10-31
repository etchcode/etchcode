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
    from etchParser import blocks

    return Response(json.dumps({
        "closeSelf": blocks.closeSelf,
        "snapNames": blocks.snapNames,
        "startChunkBlocks": blocks.startChunkBlocks,
        "abbreviations": blocks.abriviations
    }), content_type="application/json")

@app.route("/api/parse.json", methods=["POST"])
def parse():
    """Get: request paramater scripts with list of script object as generated by services/render.js that is json encoded
    Return: Parsed scripts
    """
    
    try:
        from etchParser import translator

        scripts = json.loads(json.loads(request.data.decode())["scripts"])
        variables = ["hi"]
        sprites = json.loads(json.loads(request.data.decode())["sprites"])  # don't use request.form because ng transmits data as json

        parsed = {}
        for name in scripts:
            parsed[name] = translator.translate(scripts[name], sprites, variables)  # translate it

        return Response(json.dumps(parsed), content_type="application/json")
    
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), content_type="application/json", status="500")

@app.route("/api/login.json")
def login():
    """Get: user data from mozilla persona
    Sets: user session
    Return: if login succeeded or failed
    """
