import time

def gen1():
    yield 'chunk1'
    time.sleep(1)
    yield 'chunk2'
    time.sleep(1)
    yield 'chunk3'


def gen2():
    yield from gen1