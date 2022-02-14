/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

// note: this file is also used for questions in chat

import * as mathjs from 'mathjs';

import { Part } from './part';

export enum QuestionVariableType {
    Int = 'int',
    Float = 'float',
    Complex = 'complex',
    Matrix = 'matrix',
}

export class QuestionVariable {
    id = '';
    type: QuestionVariableType;
    values: string[] = []; // index k represents variant k
    toLaTeX(idx: number): string {
        const value = this.values[idx];
        let s = '';
        switch (this.type) {
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
}

export class QuestionInputField {
    question: PartQuestion;
    type: QuestionInputFieldType;
    answerVariable: QuestionVariable = null;
    htmlElement: HTMLElement = null; // root
    htmlInputElements: HTMLInputElement[] = []; // input elements
    htmlFeedbackElement: HTMLElement = null;
    constructor(question: PartQuestion) {
        this.question = question;
    }
    evaluate(): void {
        const sampleSolution =
            this.answerVariable.values[this.question.variantIdx];
        //console.log('sample solution: ' + sampleSolution);
        const inputStrings: string[] = [];
        for (const element of this.htmlInputElements)
            inputStrings.push(element.value);
        //console.log('user solution: ' + inputStrings);
        switch (this.answerVariable.type) {
            case QuestionVariableType.Int:
            case QuestionVariableType.Float:
                if (
                    Math.abs(
                        parseFloat(sampleSolution) -
                            parseFloat(inputStrings[0]),
                    ) < 1e-6
                ) {
                    // TODO: configure precision
                    this.htmlInputElements[0].style.backgroundColor = 'green';
                    this.htmlInputElements[0].style.color = 'white';
                } else {
                    this.htmlInputElements[0].style.backgroundColor = 'red';
                    this.htmlInputElements[0].style.color = 'white';
                }
                break;
            case QuestionVariableType.Complex:
                if (
                    Math.abs(
                        mathjs.complex(sampleSolution).re -
                            parseFloat(inputStrings[0]),
                    ) < 1e-6 // TODO: configure precision
                ) {
                    this.htmlInputElements[0].style.backgroundColor = 'green';
                    this.htmlInputElements[0].style.color = 'white';
                } else {
                    this.htmlInputElements[0].style.backgroundColor = 'red';
                    this.htmlInputElements[0].style.color = 'white';
                }
                if (
                    Math.abs(
                        mathjs.complex(sampleSolution).im -
                            parseFloat(inputStrings[1]),
                    ) < 1e-6
                ) {
                    this.htmlInputElements[1].style.backgroundColor = 'green';
                    this.htmlInputElements[1].style.color = 'white';
                } else {
                    this.htmlInputElements[1].style.backgroundColor = 'red';
                    this.htmlInputElements[1].style.color = 'white';
                }
                break;
            default:
                console.assert(
                    false,
                    'unimplemented QuestionInputField: evaluate() for type ' +
                        this.answerVariable.type,
                );
        }
    }
    createHtmlElement(): void {
        this.htmlElement = document.createElement('span');
        let tmpElement: HTMLElement;
        let inputElement: HTMLInputElement;
        switch (this.type) {
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
                this.htmlFeedbackElement.style.color = '#ff0000';
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
                this.htmlFeedbackElement.style.color = '#ff0000';
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

    showVariables = false;
    showSolution = false;

    private getVariable(id: string): QuestionVariable {
        for (let i = 0; i < this.variables.length; i++) {
            const v = this.variables[i];
            if (v.id === id) return v;
        }
        return null;
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
        divRow.appendChild(divCol);
        let headline = document.createElement('p');
        headline.classList.add(
            'text-start',
            'lead',
            'py-0',
            'my-0',
            'my-1',
            'text-light',
            'rounded',
        );
        headline.innerHTML = '&nbsp;<b>Aufgabe</b>';
        headline.style.backgroundColor = '#e85b22';
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
        divContainer.appendChild(button);
        button.classList.add('btn', 'btn-primary', 'my-1');
        button.innerHTML = 'Auswerten';
        const this_ = this;
        button.addEventListener('click', function () {
            for (const inputField of this_.inputFields) {
                inputField.evaluate();
            }
        });
    }

    import(data: any): void {
        this.questionText = data['text'];
        this.error = data['error'];
        this.errorLog = data['errorLog'];
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
