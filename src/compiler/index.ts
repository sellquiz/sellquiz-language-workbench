/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

// this server side Node.js script compiles course descriptions written in the "SELL Definition Language" into JSON

import fs from 'fs';
import process from 'process';

import { Document } from './document';

//const stdin = fs.readFileSync(process.stdin.fd, 'utf-8');
//console.log(stdin);
//process.exit(0);

if (process.argv.length != 4) {
    console.error(
        'Error: usage: node compiler.ts INPUT_FILE_PATH OUTPUT_FILE_PATH',
    );
    process.exit(-1);
}

const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3];

if (fs.existsSync(inputFilePath) == false) {
    console.error('error: input file ' + inputFilePath + ' does not exist');
    process.exit(-1);
}

console.log('converting ' + inputFilePath + ' to ' + outputFilePath);

const doc = new Document();

const input = fs.readFileSync(inputFilePath, 'utf-8');
const output = doc.compile(input);

console.log('----- output -----');
console.log(output);

fs.writeFileSync(outputFilePath, output);
