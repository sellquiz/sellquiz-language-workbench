/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

// LaTeX-template for TikZ Scripts
export const TIKZ_PROG = `
\\documentclass[class=minimal,border=0pt]{standalone}
\\usepackage[latin1]{inputenc}
\\usepackage{tikz}
\\begin{document}
\\pagestyle{empty}
\\begin{tikzpicture}
$CODE$
\\end{tikzpicture}
\\end{document}
`;

// Python-template for questions
export const PYTHON_PROG = `
import math
import numpy
import random
import types
from inspect import isfunction
_import_names = ['math', 'numpy', 'sympy', 'random', 'np', 'types', 'isfunction']

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
        if isinstance(v, types.ModuleType):
            continue
        if isfunction(eval(v)):
            continue

        value = eval(v)

        # preprocessing
        if isinstance(value, list):
            value = numpy.asmatrix(value)

        # generation
        if isinstance(value, numpy.matrix):
            rows, cols = value.shape
            value = numpy.array2string(value, separator=',').replace('\\n','')
            _ids.append(v)
            _types.append('matrix' + ':' + str(rows) + ':' + str(cols))
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
            c = c.replace('j', 'i')
            if c.startswith('('):
                c = c[1:-1]
            _values.append(c)
        elif isinstance(value, set):
            _ids.append(v)
            _types.append('set:' + str(len(value)))
            value = str(value)
            _values.append(value)
        else:
            _ids.append(v)
            _types.append('unknown')
            _values.append(value)

    if __i == 0:
        for id in _ids:
            __s += id + '#'
        __s += '\\n'
        for _t in _types:
            __s += _t + '#'
        __s += '\\n'

    for value in _values:
        __s += str(value) + '#'
    __s += '\\n'

print(__s)
`;

// SageMath-template for questions
export const SAGE_PROG = `__s = ''
_vars = []
_ignore = ['In', 'Out', 'exit', 'get_ipython', 'quit']
for __i in range(0, $INSTANCES$):

$CODE$

    if __i == 0:
        _vars=show_identifiers()
    _ids=[]
    _types=[]
    _values=[]
    for v in _vars:
        if v.startswith('_') or v.startswith('__') or v in _ignore:
            continue
        value = eval(v)
        if type(value) == Integer or type(value) == int or type(value) == sage.rings.finite_rings.integer_mod.IntegerMod_int:
            _ids.append(v)
            _types.append('int')
            _values.append(value)
        else:
            _ids.append(v)
            _types.append('unknown')
            _values.append(value)

    if __i == 0:
        for id in _ids:
            __s += id + '#'
        __s += '\\n'
        for _t in _types:
            __s += _t + '#'
        __s += '\\n'

    for value in _values:
        __s += str(value) + '#'
    __s += '\\n'

print(__s)
`;

// Octave-template for questions
export const OCTAVE_PROG = `
$CODE$

%a=3;
%b=5;
%A=a*[1 2; 3 4];

% TODO: complex numbers!
% TODO: multiple instances!

_vars = who;

_ids = '';
_types = '';
_values = '';
for k=1:length(_vars)
	_ids = strcat(_ids, _vars{k}, '#');
	_value = eval(_vars{k});
	if rows(_value)==1 && columns(_value)==1
		_types = strcat(_types, 'float', '#');
	else
		_types = strcat(_types, 'matrix', '#');
	end
	_values = strcat(_values, mat2str(_value), '#');
end

disp(_ids)
disp(_types)
disp(_values)
`;

// TODO: maxima

export const MAXIMA_PROG = `display2d:false;
stardisp:true;
e:%e;
i:%i;

$CODE$
/*a:3;b:4;c:a^b;*/

values;
ev(values);
float(ev(values));
`;
// TODO: maxima output needs postprocessing
