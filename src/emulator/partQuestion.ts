/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

// note: this file is also used for questions in chat

import * as mathjs from 'mathjs';

import { Part } from './part';

const CHECK_MARK = '&#x2705;';
const CHECK_CROSS = '&#x274C;';

export enum QuestionVariableType {
    Bool = 'bool',
    Int = 'int',
    Float = 'float',
    Complex = 'complex',
    Matrix = 'matrix',
}

export class QuestionVariable {
    id = '';
    type: QuestionVariableType;
    text = '';
    values: string[] = []; // index k represents variant k
    toLaTeX(idx: number): string {
        const value = this.values[idx];
        let s = '';
        switch (this.type) {
            case QuestionVariableType.Bool:
            case QuestionVariableType.Int:
            case QuestionVariableType.Float:
            case QuestionVariableType.Complex:
                s = value;
                break;
            default:
                console.assert(
                    false,
                    'unimplemented QuestionVariable.toLaTex(..) for type ' +
                        this.type,
                );
        }
        return s;
    }
    toMathJs(idx: number): mathjs.MathType {
        const value = this.values[idx];
        switch (this.type) {
            case QuestionVariableType.Bool:
                return value === 'true' ? 1 : 0;
            case QuestionVariableType.Int:
                return parseInt(value);
            case QuestionVariableType.Float:
                return parseFloat(value);
            case QuestionVariableType.Complex:
                return mathjs.complex(value);
            default:
                console.assert(
                    false,
                    'unimplemented QuestionVariable.toMathJs(..) for type ' +
                        this.type,
                );
                return 0;
        }
    }
}

export enum QuestionInputFieldType {
    TextField = 'text-field',
    ComplexNormalform = 'complex-normalform',
    CheckBox = 'check-box',
}

export class QuestionInputField {
    question: PartQuestion;
    type: QuestionInputFieldType;
    answerVariable: QuestionVariable = null;
    htmlElement: HTMLElement = null; // root
    htmlInputElements: HTMLInputElement[] = []; // input elements
    htmlFeedbackElement: HTMLElement = null;
    correct = false;
    constructor(question: PartQuestion) {
        this.question = question;
    }
    evaluate(): void {
        const sampleSolution = this.answerVariable.toMathJs(
            this.question.variantIdx,
        );
        //console.log('sample solution: ' + sampleSolution);
        const inputStrings: string[] = [];
        for (const element of this.htmlInputElements) {
            if (this.type === QuestionInputFieldType.CheckBox)
                inputStrings.push(element.checked ? '1' : '0');
            else inputStrings.push(element.value);
        }

        //console.log('user solution: ' + inputStrings);

        let ok = false;
        switch (this.answerVariable.type) {
            case QuestionVariableType.Bool:
                ok = sampleSolution == parseInt(inputStrings[0]);
                break;
            case QuestionVariableType.Int:
            case QuestionVariableType.Float:
                ok =
                    mathjs.abs(
                        <number>(
                            mathjs.subtract(
                                <number>sampleSolution,
                                <mathjs.MathType>parseFloat(inputStrings[0]),
                            )
                        ),
                    ) < 1e-6; // TODO: configure precision
                break;
            case QuestionVariableType.Complex:
                ok =
                    mathjs.norm(
                        <mathjs.Complex>(
                            mathjs.subtract(
                                <mathjs.Complex>sampleSolution,
                                mathjs.complex(
                                    parseFloat(inputStrings[0]),
                                    parseFloat(inputStrings[1]),
                                ),
                            )
                        ),
                    ) < 1e-6; // TODO: configure precision
                break;
            default:
                console.assert(
                    false,
                    'unimplemented QuestionInputField: evaluate() for type ' +
                        this.answerVariable.type,
                );
        }
        this.correct = ok;
        if (this.answerVariable.id.startsWith('mc__') == false) {
            this.htmlFeedbackElement.innerHTML =
                '&nbsp;' + (ok ? CHECK_MARK : CHECK_CROSS);
        }
    }
    createHtmlElement(): void {
        this.htmlElement = document.createElement('span');
        let tmpElement: HTMLElement;
        let inputElement: HTMLInputElement;
        switch (this.type) {
            case QuestionInputFieldType.CheckBox:
                inputElement = document.createElement('input');
                this.htmlInputElements.push(inputElement);
                this.htmlElement.appendChild(inputElement);
                inputElement.type = 'checkbox';
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML = ''; // TODO
                //'&nbsp;&nbsp;<i class="fas fa-question"></i>';
                //this.htmlFeedbackElement.style.color = '#ff0000';
                this.htmlElement.appendChild(this.htmlFeedbackElement);
                break;
            case QuestionInputFieldType.TextField:
                inputElement = document.createElement('input');
                this.htmlInputElements.push(inputElement);
                this.htmlElement.appendChild(inputElement);
                inputElement.type = 'text';
                inputElement.classList.add('mx-1');
                inputElement.placeholder = '';
                inputElement.size = 5;
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML = ''; // TODO
                //'&nbsp;&nbsp;<i class="fas fa-question"></i>';
                //this.htmlFeedbackElement.style.color = '#ff0000';
                this.htmlElement.appendChild(this.htmlFeedbackElement);
                break;
            case QuestionInputFieldType.ComplexNormalform:
                // real part
                inputElement = document.createElement('input');
                this.htmlInputElements.push(inputElement);
                this.htmlElement.appendChild(inputElement);
                inputElement.type = 'text';
                inputElement.classList.add('mx-1');
                inputElement.placeholder = '';
                inputElement.size = 5;
                /*inputElement.addEventListener('keyup', () => {
                    this.evaluate();
                });*/
                // "+"
                tmpElement = document.createElement('span');
                tmpElement.innerHTML = this.question.coursePage
                    .getMathJaxInst()
                    .convertHTML('\\(+\\)');
                this.htmlElement.appendChild(tmpElement);
                // imaginary part
                inputElement = document.createElement('input');
                this.htmlInputElements.push(inputElement);
                this.htmlElement.appendChild(inputElement);
                inputElement.type = 'text';
                inputElement.classList.add('mx-1');
                inputElement.placeholder = '';
                inputElement.size = 5;
                /*inputElement.addEventListener('keyup', () => {
                    this.evaluate();
                });*/
                // "i"
                tmpElement = document.createElement('span');
                tmpElement.innerHTML = this.question.coursePage
                    .getMathJaxInst()
                    .convertHTML('\\(i\\)');
                this.htmlElement.appendChild(tmpElement);
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML = ''; // TODO
                //'&nbsp;&nbsp;<i class="fas fa-question"></i>';
                //this.htmlFeedbackElement.style.color = '#ff0000';
                this.htmlElement.appendChild(this.htmlFeedbackElement);
                break;
            default:
                console.assert(
                    false,
                    'unimplemented QuestionInputField.createHtmlElement(..) for type ' +
                        this.type,
                );
        }
    }
}

export class PartQuestion extends Part {
    chatMode = false;
    questionText = '';
    solutionText = '';
    options: string[] = [];
    variables: QuestionVariable[] = [];
    inputFields: QuestionInputField[] = [];
    variantIdx = 0; // TODO: random!
    maxScore = 1;
    actualScore = 0;

    htmlFeedbackElement: HTMLElement = null;

    showVariables = false;
    showScore = false;
    showSolution = false;

    private getVariable(id: string): QuestionVariable {
        for (let i = 0; i < this.variables.length; i++) {
            const v = this.variables[i];
            if (v.id === id) return v;
        }
        return null;
    }

    private getVariableIdx(id: string): number {
        for (let i = 0; i < this.variables.length; i++) {
            const v = this.variables[i];
            if (v.id === id) return i;
        }
        return -1;
    }

    private getInputFieldIdxByAnswerVariableId(answerVarId: string): number {
        for (let i = 0; i < this.inputFields.length; i++) {
            const field = this.inputFields[i];
            if (field.answerVariable.id === answerVarId) return i;
        }
        return -1;
    }

    private getHtmlElementIdx(inputFieldIndex: number): string {
        return '_' + this.index + '_' + inputFieldIndex;
    }

    generateInputElements(): void {
        for (let i = 0; i < this.inputFields.length; i++) {
            const inputField = this.inputFields[i];
            const inputFieldSpan = document.getElementById(
                this.getHtmlElementIdx(i),
            );
            inputField.createHtmlElement();
            inputFieldSpan.appendChild(<HTMLElement>inputField.htmlElement);
        }
    }

    generateText(text: string, placeInputs = false): string {
        for (const v of this.variables) {
            let oldText = '';
            do {
                oldText = text;
                text = text.replace(
                    '@' + v.id + '@',
                    v.toLaTeX(this.variantIdx),
                );
            } while (oldText !== text);
        }
        if (placeInputs) {
            if (text.includes('?mc?')) {
                // multiple choice
                const mc: number[] = []; // answer indices
                for (const inputField of this.inputFields) {
                    if (inputField.answerVariable.id.startsWith('mc__')) {
                        mc.push(mc.length);
                    }
                }
                // shuffle answers
                for (let i = 0; i < mc.length; i++) {
                    const u = Math.floor(Math.random() * mc.length);
                    const v = Math.floor(Math.random() * mc.length);
                    const tmp = mc[u];
                    mc[u] = mc[v];
                    mc[v] = tmp;
                }
                // generate checkbox placeholders and answers
                let mcStr = '<br/>';
                for (let i = 0; i < mc.length; i++) {
                    const varIdx = this.getVariableIdx('mc__' + mc[i]);
                    const fieldIdx = this.getInputFieldIdxByAnswerVariableId(
                        'mc__' + mc[i],
                    );
                    mcStr +=
                        '?' +
                        fieldIdx +
                        '? ' +
                        this.generateText(this.variables[varIdx].text, false) +
                        '<br/>';
                }
                text = text.replace('?mc?', mcStr);
            }
            for (let i = 0; i < this.inputFields.length; i++) {
                text = text.replace(
                    '?' + i + '?',
                    '<span id="' + this.getHtmlElementIdx(i) + '"></span>',
                );
            }
        }
        text = this.coursePage.getMathJaxInst().convertHTML(text);
        return text;
    }

    generateDOM(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
        divContainer.classList.add('container-fluid');
        rootElement.appendChild(divContainer);
        // question text
        const questionText = this.generateText(this.questionText, true);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-0');
        divCol.classList.add('border', 'border-dark', 'rounded');
        divRow.appendChild(divCol);
        let headline = document.createElement('h4'); // p
        headline.classList.add(
            'text-start',
            //'lead',
            'py-0',
            'my-0',
            'my-1',
            //'text-light',
            'text-dark',
            'rounded',
        );
        const title = this.title.length > 0 ? this.title : 'Aufgabe';
        headline.innerHTML = '&nbsp;' + title;
        //headline.style.backgroundColor = '#e85b22';
        //headline.style.backgroundColor = '#1b72f9';
        divCol.appendChild(headline);
        let textElement = document.createElement('p');
        textElement.classList.add('px-1', 'py-0', 'my-0');
        if (this.error) {
            textElement.innerHTML = '<pre>' + this.errorLog + '</pre>';
        } else textElement.innerHTML = questionText;
        divCol.appendChild(textElement);
        //this.addReadEventListener(divContainer);
        this.generateInputElements();
        // variable values
        if (this.showVariables) {
            let variableValues = '';
            for (const v of this.variables) {
                variableValues += v.id + '=' + v.toMathJs(0) + ', &nbsp;';
            }
            headline = document.createElement('p');
            headline.classList.add(
                'text-start',
                'lead',
                'py-0',
                'my-0',
                'my-1',
                'bg-info',
                'text-white',
            );
            headline.innerHTML = '&nbsp;<b>Variablen</b>';
            divCol.appendChild(headline);
            textElement = document.createElement('p');
            textElement.classList.add(
                'px-1',
                'py-0',
                'my-0',
                'bg-info',
                'text-white',
            );
            textElement.innerHTML = variableValues;
            divCol.appendChild(textElement);
        }
        // answer text
        if (this.showSolution) {
            const solutionText = this.generateText(this.solutionText);
            headline = document.createElement('p');
            headline.classList.add(
                'text-start',
                'lead',
                'py-0',
                'my-0',
                'my-1',
                'bg-success',
                'text-white',
            );
            headline.innerHTML = '&nbsp;<b>Lösung</b>';
            divCol.appendChild(headline);
            textElement = document.createElement('p');
            textElement.classList.add(
                'px-1',
                'py-0',
                'my-0',
                'bg-success',
                'text-white',
            );
            textElement.innerHTML = solutionText;
            divCol.appendChild(textElement);
        }
        // save button
        const button = document.createElement('button');
        button.type = 'button';
        divCol.appendChild(button);
        button.classList.add('btn', 'btn-primary', 'btn-sm', 'my-1');
        button.innerHTML = 'Auswerten';
        const this_ = this;
        button.addEventListener('click', function () {
            let allCorrect = true;
            this_.actualScore = 0;
            for (const inputField of this_.inputFields) {
                inputField.evaluate();
                if (inputField.correct) {
                    this_.actualScore += 1.0 / this_.inputFields.length;
                } else {
                    allCorrect = false;
                }
            }
            this_.htmlFeedbackElement.innerHTML = allCorrect
                ? CHECK_MARK
                : CHECK_CROSS;
            if (this_.showScore) {
                this_.htmlFeedbackElement.innerHTML +=
                    '&nbsp' + this_.actualScore + ' / ' + this_.maxScore;
            }
        });
        // feedback element
        this.htmlFeedbackElement = document.createElement('span');
        this.htmlFeedbackElement.classList.add('mx-3');
        this.htmlFeedbackElement.innerHTML = '';
        divCol.appendChild(this.htmlFeedbackElement);
        // spacing
        divContainer.appendChild(document.createElement('br'));
    }

    import(data: any): void {
        this.questionText = data['text'];
        this.error = data['error'];
        this.errorLog = data['errorLog'];
        this.title = data['title'];
        if ('solution' in data) {
            this.solutionText = data['solution'];
        }
        if ('options' in data) {
            for (const option of data['options']) {
                this.options.push(option);
            }
        }
        for (let i = 0; i < data['variable-ids'].length; i++) {
            const vId = data['variable-ids'][i];
            const variable = new QuestionVariable();
            this.variables.push(variable);
            variable.id = vId;
            const typeStr = data['variable-types'][i];
            switch (typeStr) {
                case 'bool':
                    variable.type = QuestionVariableType.Bool;
                    break;
                case 'int':
                    variable.type = QuestionVariableType.Int;
                    break;
                case 'float':
                    variable.type = QuestionVariableType.Float;
                    break;
                case 'complex':
                    variable.type = QuestionVariableType.Complex;
                    break;
                default:
                    console.assert(
                        false,
                        'unimplemented variable type ' + typeStr,
                    );
            }
        }
        for (let i = 0; i < data['variable-values'].length; i++) {
            const variant = data['variable-values'][i];
            for (let j = 0; j < variant.length; j++) {
                const value = variant[j];
                this.variables[j].values.push(value);
            }
        }
        for (let i = 0; i < data['variable-texts'].length; i++) {
            this.variables[i].text = data['variable-texts'][i];
        }
        for (let i = 0; i < data['input-field-types'].length; i++) {
            const inputField = new QuestionInputField(this);
            this.inputFields.push(inputField);
            const inputFieldTypeStr = data['input-field-types'][i];
            switch (inputFieldTypeStr) {
                case 'text-field':
                    inputField.type = QuestionInputFieldType.TextField;
                    break;
                case 'complex-normalform':
                    inputField.type = QuestionInputFieldType.ComplexNormalform;
                    break;
                case 'check-box':
                    inputField.type = QuestionInputFieldType.CheckBox;
                    break;
                default:
                    console.assert(
                        false,
                        'unimplemented input field type ' + inputFieldTypeStr,
                    );
            }
            inputField.answerVariable = this.getVariable(
                data['input-field-answers'][i],
            );
        }
    }
}
