import importlib

__all__ = ["add_documents", "query_documents", "delete_documents", "list_documents"]

_module_map = {
    "add_documents": "ingestion",
    "query_documents": "retrieval",
    "list_documents": "retrieval",
    "delete_documents": "deletion",
}


def __getattr__(name):
    if name in _module_map:
        module = importlib.import_module(f".{_module_map[name]}", __package__)
        return getattr(module, name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def __dir__():
    return sorted(__all__)
