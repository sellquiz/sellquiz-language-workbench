/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import fs from 'fs';
import { execSync } from 'child_process';

import { JSONType, makeTempDirectory, deleteTempDirectory } from './help';
import { Part, PartType } from './part';
import { OCTAVE_PROG, PYTHON_PROG, SAGE_PROG } from './strings';

export class Question {
    variableIDs: string[] = [];
    variableTypes: string[] = [];
    variableValues: string[][] = [];
    inputFieldTypes: string[] = [];
    inputFieldAnswers: string[] = [];
    text = '';
    solutionText = '';

    compileQuestion(part: Part): void {
        part.type = PartType.question;
        // TODO: options
        if ('text' in part.labeledText) this.text = part.labeledText['text'];
        if ('solution' in part.labeledText)
            this.solutionText = part.labeledText['solution'];
        if (
            'python' in part.labeledText ||
            'sage' in part.labeledText ||
            'octave' in part.labeledText
        ) {
            let command = '',
                filename = '',
                template = '',
                code = '';
            if ('python' in part.labeledText) {
                command = 'python3';
                filename = 'sell.py';
                template = PYTHON_PROG;
                code = part.labeledText['python'];
                code = '    ' + code.replace(/\n/g, '\n    ');
            } else if ('sage' in part.labeledText) {
                command = 'sage';
                filename = 'sell.sage';
                template = SAGE_PROG;
                code = part.labeledText['sage'];
                code = '    ' + code.replace(/\n/g, '\n    ');
            } else {
                // TODO: add ";" at end of each code line to prevent output!!
                command = 'octave';
                filename = 'sell.m';
                template = OCTAVE_PROG;
                code = part.labeledText['octave'];
            }
            const tmpDir = makeTempDirectory();
            let res = '';
            const prog = template
                .replace('$CODE$', code)
                .replace('$INSTANCES$', '5'); // TODO: config number of instances
            fs.writeFileSync(tmpDir + filename, prog);
            try {
                res = execSync(command + ' ' + tmpDir + filename, {
                    encoding: 'utf-8',
                    timeout: 10000,
                    stdio: 'pipe',
                });
            } catch (e) {
                part.error = true;
                part.errorLog = (e as any)['stderr'];
                console.log(part.text);
            }
            deleteTempDirectory(tmpDir);
            if (part.error == false) {
                const lines = res.split('\n');
                this.variableIDs = lines[0].split('#');
                this.variableIDs.pop();
                this.variableTypes = lines[1].split('#');
                this.variableTypes.pop();
                for (let j = 2; j < lines.length; j++) {
                    if (lines[j].trim().length == 0) continue;
                    const values = lines[j].split('#');
                    values.pop();
                    this.variableValues.push(values);
                }
            }
        }
        this.text = this.compileText(this.text, true);
        this.solutionText = this.compileText(this.solutionText);
    }

    private compileText(text: string, generateInputFields = false): string {
        let res = '';
        const n = text.length;
        let inMath = false;
        let hashtag = false;
        // tokenize
        const tokens: string[] = [];
        let token = '';
        for (let i = 0; i < n; i++) {
            const ch = text[i];
            if (
                token.length == 0 &&
                ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))
            ) {
                token += ch;
            } else if (
                token.length > 0 &&
                ((ch >= 'a' && ch <= 'z') ||
                    (ch >= 'A' && ch <= 'Z') ||
                    (ch >= '0' && ch <= '9'))
            ) {
                token += ch;
            } else if (ch === '"') {
                if (token.length > 0) {
                    tokens.push(token);
                    token = '';
                }
                token += '"';
                i++;
                while (i < n && text[i] !== '"') {
                    token += text[i];
                    i++;
                }
                if (i < n && text[i] === '"') {
                    token += '"';
                    i++;
                }
                i--;
            } else {
                if (token.length > 0) {
                    tokens.push(token);
                    token = '';
                }
                tokens.push(ch);
            }
        }
        if (token.length > 0) tokens.push(token);
        // compile
        for (token of tokens) {
            if (
                generateInputFields &&
                inMath == false &&
                hashtag &&
                this.variableIDs.includes(token)
            ) {
                res += '?' + this.inputFieldAnswers.length + '?';
                this.inputFieldAnswers.push(token);
                let type = this.variableTypes[this.variableIDs.indexOf(token)];
                if (type === 'int') type = 'text-field';
                else if (type === 'float') type = 'text-field';
                else if (type === 'complex') type = 'complex-normalform'; // TODO: needs to be configurable
                this.inputFieldTypes.push(type);
            } else if (token === '$') {
                inMath = !inMath;
                res += '$';
            } else if (inMath && this.variableIDs.includes(token)) {
                res += '@' + token + '@';
            } else if (inMath && token.startsWith('"') && token.endsWith('"')) {
                res += token.substring(1, token.length - 1);
            } else if (token === '#') {
                hashtag = true;
            } else {
                res += token;
                hashtag = false;
            }
        }
        return res;
    }

    toJson(json: JSONType): void {
        json['text'] = this.text;
        json['solution'] = this.solutionText;
        json['variable-ids'] = this.variableIDs;
        json['variable-types'] = this.variableTypes;
        json['variable-values'] = this.variableValues;
        json['input-field-types'] = this.inputFieldTypes;
        json['input-field-answers'] = this.inputFieldAnswers;
    }
}
