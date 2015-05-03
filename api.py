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

@app.route("/api/parse.json", methods=["post"])
def parse():
    """Get: request paramater scripts with dict of scripts and their sprite names that is json encoded
    Return: Parsed scripts
    """
    try:
        from parser import translator

        scripts = json.loads(request.form.get("scripts"))

        parsed = {}
        for script in scripts:
            parsed[script] = translator.translate(scripts[script]) # translate it

        return Response(json.dumps(parsed), content_type="application/json")
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), content_type="application/json", status="500")