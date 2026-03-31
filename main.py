import json
import sys

args = sys.argv[1:]

match args[0]:
    case "chat":
        from app.chat import chat

        with open("active_collections.json", "r") as f:
            cids = json.load(f)["active_collections"]
        with open("rag_config.json", "r") as f:
            rag_config = json.load(f)
        chat(cids, **rag_config)

    case "documents":
        match args[1]:
            case "ingest":
                from app.ingest import ingest_documents

                ingest_documents(args[2:])
            case "manage":
                from app.documents import manage_documents

                manage_documents()
