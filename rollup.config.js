import resolve  from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

// TODO: must configure babel!! e.g. "replaceAll" is still in output!

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
            'sellquiz': 'sellquiz'
        }
    },
    external: [
        'codemirror',
        'jquery',
        'mathjax',
        'sellquiz'
    ],
    plugins: [
        resolve(),
        babel({ babelHelpers: 'bundled' }),
        terser()
    ]
};
