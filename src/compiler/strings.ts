/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

export const PYTHON_PROG = `
import math
import numpy
import random
_import_names = ['math', 'numpy', 'random']

__s = ''
_vars = [];
for __i in range(0, $INSTANCES$):

$CODE$

    if __i == 0:
        _vars=dir()
    _ids=[]
    _types=[]
    _values=[]
    for v in _vars:
        if v.startswith('_') or v.startswith('__'):
            continue
        if v in _import_names:
            continue
        value = eval(v)
        if isinstance(value, numpy.matrix):
            value = numpy.array2string(A, separator=',').replace('\\n','')
            _ids.append(v)
            _types.append('matrix')
            _values.append(value)
        elif isinstance(value, int):
            _ids.append(v)
            _types.append('int')
            _values.append(value)
        elif isinstance(value, float):
            _ids.append(v)
            _types.append('float')
            _values.append(value)
        elif isinstance(value, complex):
            _ids.append(v)
            _types.append('complex')
            c = str(value)
            c.replace('j', 'i')
            if c.startswith('('):
                c = c[1:-1]
            _values.append(c)
        else:
            _ids.append(v)
            _types.append('unknown')
            _values.append(value)

    if __i == 0:
        for id in _ids:
            __s += id + '#'
        __s += '\\n'
        for type in _types:
            __s += type + '#'
        __s += '\\n'

    for value in _values:
        __s += str(value) + '#'
    __s += '\\n'

print(__s)
`;
