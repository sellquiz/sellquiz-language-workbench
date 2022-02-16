/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { JSONType } from './help';
import { Question } from './question';
import { Image } from './image';
import { Authentication } from './authentication';
import { ProgrammingQuestion } from './programmingQuestion';

export enum PartType {
    unknown = 'unknown',
    error = 'error',
    uncompiledBlock = 'uncompiled-block',
    headline1 = 'headline-1',
    headline2 = 'headline-2',
    headline3 = 'headline-3',
    paragraph = 'paragraph',
    definition = 'definition',
    example = 'example',
    question = 'question',
    programmingQuestion = 'programming-question',
    image = 'image',
    newPage = 'new-page',
    authentication = 'authentication',
}

export class Part {
    id = '';
    title = '';
    src = '';
    type = PartType.unknown;
    text = '';
    error = false;
    errorLog = '';
    labeledText: { [id: string]: string } = {};
    inputLineNo = 0;

    question: Question = null;
    programmingQuestion: ProgrammingQuestion = null;
    image: Image = null;
    authentication: Authentication = null;

    oldJson: JSONType = null;
    constructor(inputLineNo: number) {
        this.inputLineNo = inputLineNo;
    }
    toJson(): JSONType {
        if (this.oldJson != null) return this.oldJson;
        const j: JSONType = {};
        j.type = this.type;
        j.inputLineNo = this.inputLineNo;
        j.text = this.text;
        j.title = this.title;
        j.error = this.error;
        j.errorLog = this.errorLog;
        j.src = this.src;
        if (this.question != null) this.question.toJson(j);
        if (this.programmingQuestion != null)
            this.programmingQuestion.toJson(j);
        if (this.image != null) this.image.toJson(j);
        if (this.authentication != null) this.authentication.toJson(j);
        return j;
    }
}
