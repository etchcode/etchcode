from flask import Flask, Response

import json

app = Flask("api")
app.config.from_pyfile("config.py")

@app.route("/api/blocks.json")
def blocks():
    import parser.blocks

    return Response(json.dumps({
        "closeSelf": parser.blocks.closeSelf,
        "snapNames": parser.blocks.snapNames,
        "startChunkBlocks": parser.blocks.startChunkBlocks,
        "abbreviations": parser.blocks.abriviations
    }), content_type="application/json")
