/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { JSONType } from './help';
import { Question } from './question';

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
    newPage = 'new-page',
}

export class Part {
    id = '';
    type = PartType.unknown;
    text = '';
    error = false;
    labeledText: { [id: string]: string } = {};
    inputLineNo = 0;
    question: Question = null;
    constructor(inputLineNo: number) {
        this.inputLineNo = inputLineNo;
    }
    toJson(): JSONType {
        const j: JSONType = {};
        j.type = this.type;
        j.inputLineNo = this.inputLineNo;
        j.text = this.text;
        j.error = this.error;
        if (this.question != null) this.question.toJson(j);
        return j;
    }
}
