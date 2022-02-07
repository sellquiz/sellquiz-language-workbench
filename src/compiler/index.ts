/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

// this server side Node.js script compiles course descriptions written in the "SELL Definition Language" into JSON

import fs from 'fs';
import process from 'process';

import { JSONType } from './help';
import { Part, PartType } from './part';
import { Question } from './question';

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

class Document {
    private type = 'course-page';
    private isAsciiMath = true;
    private title = '';
    private tags: string[] = [];
    private parts: Part[] = [];
    private section = 1;
    private subsection = 2;
    private susubsection = 3;
    private forceNewParagraph = false;
    compile(inputPath: string) {
        const input = fs.readFileSync(inputPath, 'utf-8');
        const lines = input.split('\n');
        const n = lines.length;
        for (let lineIdx = 0; lineIdx < n; lineIdx++) {
            let line = lines[lineIdx];
            if (line.trim().startsWith('%'))
                // TODO: comments within line
                continue;
            if (line.trim().length == 0) {
                this.forceNewParagraph = true;
            } else if (line.startsWith('##### ')) {
                this.title = line.substring(6).trim();
            } else if (line.startsWith('=====')) {
                const part = new Part(lineIdx + 1);
                this.parts.push(part);
                part.type = PartType.newPage;
            } else if (line.startsWith('!')) {
                if (line.startsWith('!tex')) this.isAsciiMath = false;
                // TODO
            } else if (line.startsWith('# ')) {
                const part = new Part(lineIdx + 1);
                this.parts.push(part);
                part.type = PartType.headline1;
                part.text = this.section + '. ' + line.substring(2).trim();
                this.section++;
                this.subsection = 1;
                this.susubsection = 1;
            } else if (line.startsWith('## ')) {
                const part = new Part(lineIdx + 1);
                this.parts.push(part);
                part.type = PartType.headline1;
                part.text =
                    this.section +
                    '.' +
                    this.subsection +
                    ' ' +
                    line.substring(2).trim();
                this.subsection++;
                this.susubsection = 1;
            } else if (line.startsWith('### ')) {
                const part = new Part(lineIdx + 1);
                this.parts.push(part);
                part.type = PartType.headline1;
                part.text =
                    this.section +
                    '.' +
                    this.subsection +
                    '.' +
                    this.susubsection +
                    ' ' +
                    line.substring(2).trim();
                this.susubsection++;
            } else if (line.startsWith('---')) {
                const part = new Part(lineIdx + 1);
                this.parts.push(part);
                part.type = PartType.uncompiledBlock;
                let textId = '';
                lineIdx++;
                let first = true;
                while (lineIdx < n) {
                    line = lines[lineIdx];
                    if (first) {
                        part.id = line.trim();
                    }
                    if (line.startsWith('---')) {
                        break;
                    } else if (line.startsWith('@')) {
                        textId = line.substring(1).trim();
                    } else if (!first) {
                        if (textId in part.labeledText == false)
                            part.labeledText[textId] = line + '\n';
                        else part.labeledText[textId] += line + '\n';
                    }
                    if (first) first = false;
                    lineIdx++;
                } // TODO: check EOF
            } else {
                let part: Part = null;
                if (
                    !this.forceNewParagraph &&
                    this.parts.length > 0 &&
                    this.parts.slice(-1)[0].type == PartType.paragraph
                ) {
                    part = this.parts.slice(-1)[0];
                } else {
                    part = new Part(lineIdx + 1);
                    part.type = PartType.paragraph;
                    this.parts.push(part);
                }
                part.text += line + '\n';
                this.forceNewParagraph = false;
            }
        }
        // post process
        for (const part of this.parts) {
            switch (part.type) {
                case PartType.paragraph:
                    part.text = this.compileParagraph(part.text);
                    break;
                case PartType.uncompiledBlock:
                    if (part.id === 'Definition') this.compileDefinition(part);
                    else if (part.id === 'Example') this.compileExample(part);
                    else if (part.id === 'Question') {
                        part.question = new Question();
                        part.question.compileQuestion(part);
                        part.question.text = this.compileParagraph(
                            part.question.text,
                        );
                        part.question.solutionText = this.compileParagraph(
                            part.question.solutionText,
                        );
                    } else {
                        part.type = PartType.error;
                        part.text =
                            "error: unknown part type '" + part.id + "'";
                    }
                    break;
            }
        }
    }
    private compileDefinition(part: Part): void {
        part.type = PartType.definition;
        part.text = this.compileParagraph(part.labeledText['']);
    }
    private compileExample(part: Part): void {
        part.type = PartType.example;
        part.text = this.compileParagraph(part.labeledText['']);
    }
    private compileParagraph(text: string): string {
        let res = '';
        const n = text.length;
        let isBold = false;
        let isItalic = false;
        let isList = false;
        let isListItem = false;
        let col = 0;
        for (let i = 0; i < n; i++) {
            const ch = text[i];
            if (col == 0 && ch === '-') {
                if (isListItem) res += '</li>';
                if (!isList) res += '<ul>';
                isList = true;
                isListItem = true;
                res += '<li>';
                col++;
                continue;
            } else if (col == 0 && isList) {
                if (ch === ' ' || ch === '\t') {
                    res += '<br/>';
                } else {
                    isListItem = false;
                    isList = false;
                    res += '</li></ul>';
                }
            }
            if (ch === '$') {
                let eqn = '';
                // TODO: split equation for line breaks!!!!!
                for (let j = i + 1; j < n; j++) {
                    const ch2 = text[j];
                    if (ch2 == '$') {
                        i = j;
                        break;
                    }
                    eqn += ch2;
                }
                res += '\\(' + eqn + '\\)';
            } else if (ch === '*') {
                if (text.substring(i).startsWith('**')) {
                    i++;
                    isBold = !isBold;
                    res += isBold ? '<b>' : '</b>';
                } else {
                    isItalic = !isItalic;
                    res += isItalic ? '<i>' : '</i>';
                }
            } else if (ch === '\n') {
                col = -1;
            } else {
                res += ch;
            }
            col++;
        }
        if (isBold) res += '</b>';
        if (isItalic) res += '</i>';
        if (isList) res += '</li></ul>';
        return res;
    }
    toJson(): JSONType {
        const j: JSONType = {};
        j.type = this.type;
        j.title = this.title;
        j.tags = this.tags;
        j.parts = [];
        for (const part of this.parts) {
            (<JSONType[]>j.parts).push(part.toJson());
        }
        return j;
    }
}

const document = new Document();
document.compile(inputFilePath);

const output = JSON.stringify(document.toJson(), null, 4);
console.log('----- output -----');
console.log(output);

fs.writeFileSync(outputFilePath, output);
