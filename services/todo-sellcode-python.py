import math
import numpy
import random
_import_names = ['math', 'numpy', 'random']

# --- BEGIN OF "SELL" CODE ---
a=5
b=3.14
c=math.pi
A=numpy.matrix([[1,2],[3,4]])
d=numpy.linalg.det(A)
# --- END OF "SELL" CODE ---

_vars=dir()
_types=[]
_values=[]
for v in _vars:
    if v.startswith('_') or v.startswith('__'):
        continue
    if v in _import_names:
        continue
    value = eval(v)
    if isinstance(value, numpy.matrix):
        value = numpy.array2string(A, separator=',').replace('\n','')
        _types.append('matrix')
        _values.append(value)
    elif isinstance(value, int):
        _types.append('int')
        _values.append(value)
    elif isinstance(value, float):
        _types.append('float')
        _values.append(value)
    else:
        _types.append('unknown')
        _values.append(value)

s = ''
for type in _types:
    s += type + '#'

s += '\n'
for value in _values:
    s += str(value) + '#'

print(s)
