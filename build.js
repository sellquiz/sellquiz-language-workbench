/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 *                                                                            *
 * Partly funded by: Digitale Hochschule NRW                                  *
 * https://www.dh.nrw/kooperationen/hm4mint.nrw-31                            *
 *                                                                            *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 *                                                                            *
 * This library is licensed as described in LICENSE, which you should have    *
 * received as part of this distribution.                                     *
 *                                                                            *
 * This software is distributed on "AS IS" basis, WITHOUT WARRENTY OF ANY     *
 * KIND, either impressed or implied.                                         *
 ******************************************************************************/

const esbuild = require('esbuild');

esbuild.buildSync({
    platform: 'node',
    globalName: 'slwCompiler',
    minify: false, // TODO
    target: 'es2020',
    entryPoints: ['src/compiler/index.ts'],
    bundle: true,
    outfile: 'dist/slwCompiler.min.js',
});

esbuild.buildSync({
    platform: 'browser',
    globalName: 'slwEditor',
    minify: false, // TODO
    target: 'es2020',
    entryPoints: ['src/editor/index.ts'],
    bundle: true,
    outfile: 'dist/slwEditor.min.js',
});

esbuild.buildSync({
    platform: 'browser',
    globalName: 'slwEMU',
    minify: false, // TODO
    target: 'es2020',
    entryPoints: ['src/emulator/index.ts'],
    bundle: true,
    outfile: 'dist/slwEmulator.min.js',
});
