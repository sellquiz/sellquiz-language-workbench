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
import { PYTHON_PROG } from './strings';

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
        if ('python' in part.labeledText) {
            const tmpDir = makeTempDirectory();
            let res = '';
            const code =
                '    ' + part.labeledText['python'].replace(/\n/g, '\n    ');
            const prog = PYTHON_PROG.replace('$CODE$', code).replace(
                '$INSTANCES$',
                '5',
            ); // TODO: config number of instances
            fs.writeFileSync(tmpDir + 'sell.py', prog);
            try {
                res = execSync('python3 ' + tmpDir + 'sell.py', {
                    encoding: 'utf-8',
                    timeout: 10000,
                    stdio: 'pipe',
                });
            } catch (e) {
                part.error = true;
                part.text = (e as any)['stderr'];
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
        let id = '';
        let inMath = false;
        let hashtag = false;
        text = text + ' '; // text should not end with an ID
        for (let i = 0; i < n; i++) {
            const ch = text[i];
            if (
                id.length == 0 &&
                ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))
            ) {
                id += ch;
            } else if (
                id.length > 0 &&
                ((ch >= 'a' && ch <= 'z') ||
                    (ch >= 'A' && ch <= 'Z') ||
                    (ch >= '0' && ch <= '9'))
            ) {
                id += ch;
            } else {
                if (
                    generateInputFields &&
                    !inMath &&
                    hashtag &&
                    id.length > 0 &&
                    this.variableIDs.includes(id)
                ) {
                    res += '?' + this.inputFieldAnswers.length + '?';
                    this.inputFieldAnswers.push(id);
                    let type = this.variableTypes[this.variableIDs.indexOf(id)];
                    if (type === 'complex') type = 'complex-normalform'; // TODO: needs to be configurable
                    this.inputFieldTypes.push(type);
                } else if (
                    inMath &&
                    id.length > 0 &&
                    this.variableIDs.includes(id)
                ) {
                    res += '@' + id + '@';
                } else if (id.length > 0) {
                    res += id;
                }
                if (ch === '$') inMath = !inMath;
                hashtag = inMath == false && ch === '#';
                id = '';
                if (!hashtag) res += ch;
            }
        }
        return res;
    }

    toJson(json: JSONType): void {
        json['text'] = this.text;
        json['solution'] = this.solutionText;
        json['variable-ids'] = this.variableIDs;
        json['variable-types'] = this.variableTypes;
        json['input-field-types'] = this.inputFieldTypes;
        json['input-field-answers'] = this.inputFieldAnswers;
    }
}
