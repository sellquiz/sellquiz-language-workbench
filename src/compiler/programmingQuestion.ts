/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part, PartType } from './part';
import { JSONType } from './help';

export enum ProgrammingQuestionType {
    JavaProgram = 'JavaProgram',
}

export class ProgrammingQuestion {
    type = ProgrammingQuestionType.JavaProgram;
    text = '';
    solutionText = '';

    compileProgrammingQuestion(
        part: Part,
        type: ProgrammingQuestionType,
    ): void {
        part.type = PartType.programmingQuestion;

        this.type = type;
        if ('text' in part.labeledText) {
            this.text = part.labeledText['text'];
        }
        if ('solution' in part.labeledText) {
            this.solutionText = part.labeledText['solution'];
        }
    }

    toJson(json: JSONType): void {
        json['programming-type'] = this.type;
        json['text'] = this.text;
        json['solution'] = this.solutionText;
    }
}
