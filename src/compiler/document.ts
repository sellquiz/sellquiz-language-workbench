/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { JSONType } from './help';
import { Image } from './image';
import { Part, PartType } from './part';
import { Question } from './question';
import {
    ProgrammingQuestion,
    ProgrammingQuestionType,
} from './programmingQuestion';
import { Authentication } from './authentication';

export class Document {
    private type = 'course-page';
    private isAsciiMath = true;
    private title = '';
    private tags: string[] = [];
    private parts: Part[] = [];
    private section = 1;
    private subsection = 2;
    private susubsection = 3;
    private forceNewParagraph = false;
    private oldOutput: JSONType = null;

    compile(input: string, oldOutput: JSONType): string {
        this.oldOutput = oldOutput;
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
                    part.src += line + '\n';
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
                if (this.oldOutput != null) {
                    // do not compile again, if old output can be reused
                    const oldParts = <Array<JSONType>>this.oldOutput['parts'];
                    for (const oldPart of oldParts) {
                        if (
                            'src' in oldPart &&
                            (<string>oldPart.src).length > 0 &&
                            oldPart.src === part.src
                        ) {
                            part.type = <PartType>oldPart.type;
                            part.oldJson = oldPart;
                        }
                    }
                }
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
            if ('title' in part.labeledText)
                part.title = part.labeledText['title'];
            switch (part.type) {
                case PartType.paragraph:
                    part.text = this.compileParagraph(part.text);
                    break;
                case PartType.uncompiledBlock:
                    if (part.id === 'Authentication.') {
                        this.compileAuthentication(part);
                    } else if (part.id === 'Definition.') {
                        this.compileDefinition(part);
                    } else if (part.id === 'Example.') {
                        this.compileExample(part);
                    } else if (part.id === 'Question.') {
                        this.compileQuestion(part);
                    } else if (part.id === 'Tikz.') {
                        this.compileImage(part);
                    } else if (part.id === 'JavaQuestion.') {
                        this.compileProgrammingQuestion(
                            ProgrammingQuestionType.JavaProgram,
                            part,
                        );
                    } else {
                        part.type = PartType.error;
                        part.text =
                            "error: unknown part type '" + part.id + "'";
                    }
                    break;
            }
        }
        return JSON.stringify(this.toJson(), null, 4);
    }

    private compileAuthentication(part: Part): void {
        part.authentication = new Authentication();
        part.authentication.compileAuthentication(part);
    }

    private compileDefinition(part: Part): void {
        part.type = PartType.definition;
        part.text = this.compileParagraph(part.labeledText['']);
    }

    private compileExample(part: Part): void {
        part.type = PartType.example;
        part.text = this.compileParagraph(part.labeledText['']);
    }

    private compileQuestion(part: Part): void {
        part.question = new Question();
        part.question.compileQuestion(part, 5); // TODO: config number of instances
        part.question.text = this.compileParagraph(part.question.text);
        part.question.solutionText = this.compileParagraph(
            part.question.solutionText,
        );
    }

    private compileProgrammingQuestion(
        type: ProgrammingQuestionType,
        part: Part,
    ): void {
        part.programmingQuestion = new ProgrammingQuestion();
        part.programmingQuestion.compileProgrammingQuestion(part, type);
    }

    private compileImage(part: Part): void {
        part.image = new Image();
        part.image.compileImage(part);
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
                res += ch;
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
