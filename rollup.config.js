import resolve  from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'tmp/index.js',
    output: {
        file: 'dist/sellquiz-language-workbench.min.js',
        format: 'iife',
        name: 'slw',
        globals: {
            'codemirror': 'CodeMirror',
            'mathjax': 'MathJax',
            'jquery': '$',
            'sellquiz': 'sellquiz',
            'nspell': 'nspell',
            //'LZString': 'LZString'
        }
    },
    external: [
        'codemirror',
        'jquery',
        'mathjax',
        'sellquiz',
        'nspell',
        //'LZString'
    ],
    plugins: [
        resolve(),
        commonjs(),
        babel({ babelHelpers: 'bundled' }),
        terser()
    ]
};
