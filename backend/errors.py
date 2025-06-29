class AppError(Exception):
    def __init__(self, detail: str, status_code: int = 400):
        self.detail = detail
        self.status_code = status_code

class InvalidFileFormatError(AppError):
    def __init__(self, filenames: list[str]):
        super().__init__(f'Unsupported file format for files: {filenames}', status_code=415)

class EmptyFileError(AppError):
    def __init__(self, filenames: list[str]):
        super().__init__(f'The following files are empty: {filenames}', status_code=400)