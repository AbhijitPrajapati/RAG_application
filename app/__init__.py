import importlib

__all__ = ["chat", "manage_documents", "ingest_documents"]

_module_map = {
    "chat": "chat",
    "manage_documents": "documents",
    "ingest_documents": "ingest",
}


def __getattr__(name):
    if name in _module_map:
        module = importlib.import_module(f".{_module_map[name]}", __package__)
        return getattr(module, name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def __dir__():
    return sorted(__all__)
