/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 *                                                                            *
 * Partly funded by: Digitale Hochschule NRW                                  *
 * https://www.dh.nrw/kooperationen/hm4mint.nrw-31                            *
 *                                                                            *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 *                                                                            *
 * This library is licensed as described in LICENSE, which you should have    *
 * received as part of this distribution.                                     *
 *                                                                            *
 * This software is distributed on "AS IS" basis, WITHOUT WARRENTY OF ANY     *
 * KIND, either impressed or implied.                                         *
 ******************************************************************************/

import axios from 'axios';

abstract class Part {
    coursePage: CoursePage;
    index = 0;
    readFlag = false;
    static indexCounter = 0;
    constructor(coursePage: CoursePage) {
        this.coursePage = coursePage;
        this.index = Part.indexCounter++;
    }
    abstract import(data: any): void;
    abstract generate(rootElement: HTMLElement): void;
    addReadEventListener(element: HTMLElement): void {
        const this_ = this;
        element.addEventListener('click', (event) => {
            this_.readFlag = !this_.readFlag;
            if (this_.readFlag) {
                element.style.backgroundColor = '#d0ffd0';
            } else {
                element.style.backgroundColor = '#ffffff';
            }
            this_.coursePage.refreshProgressBars();
        });
    }
}

class PartHeadline extends Part {
    text = '';
    generate(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1');
        divRow.appendChild(divCol);
        divCol.innerHTML = '<h2>' + this.text + '</h2>';
    }
    import(data: any): void {
        this.text = data['text'];
    }
}

class PartParagraph extends Part {
    text = '';
    generate(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-0');
        divRow.appendChild(divCol);
        divCol.innerHTML = '<p>' + this.text + '</p>';
        this.addReadEventListener(divContainer);
    }
    import(data: any): void {
        this.text = data['text'];
    }
}

class PartDefinition extends Part {
    text = '';
    generate(rootElement: HTMLElement): void {
        // TODO: remove duplicate code in "generate" from all parts...
        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        divContainer.style.borderLeftStyle = 'solid';
        divContainer.style.borderRightStyle = 'solid';
        divContainer.style.borderWidth = '8px';
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1');
        divRow.appendChild(divCol);
        const headline = document.createElement('p');
        headline.classList.add('text-start', 'lead', 'py-0', 'my-0', 'my-1');
        headline.innerHTML = '<b>Definition</b>';
        divCol.appendChild(headline);
        const text = document.createElement('p');
        text.innerHTML = this.text;
        divCol.appendChild(text);
        this.addReadEventListener(divContainer);
    }
    import(data: any): void {
        this.text = data['text'];
    }
}

class PartExample extends Part {
    text = '';
    generate(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1');
        divRow.appendChild(divCol);
        const headline = document.createElement('p');
        headline.classList.add('text-start', 'lead', 'py-0', 'my-0', 'my-1');
        headline.innerHTML = '<b>Beispiel</b>';
        divCol.appendChild(headline);
        const text = document.createElement('p');
        text.innerHTML = this.text;
        divCol.appendChild(text);
        this.addReadEventListener(divContainer);
    }
    import(data: any): void {
        this.text = data['text'];
    }
}

enum QuestionVariableType {
    Int = 'int',
    Float = 'float',
    Complex = 'complex',
    Matrix = 'matrix',
}

class QuestionVariable {
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
}

enum QuestionInputFieldType {
    TextField = 'text-field',
    ComplexNormalform = 'complex-normalform',
}

class QuestionInputField {
    question: PartQuestion;
    type: QuestionInputFieldType;
    answerVariable: QuestionVariable = null;
    htmlElement: HTMLElement = null; // root
    htmlInputElements: HTMLInputElement[] = [];
    htmlFeedbackElement: HTMLElement = null;
    constructor(question: PartQuestion) {
        this.question = question;
    }
    evaluate(): void {
        const sampleSolution =
            this.answerVariable.values[this.question.variantIdx];
        console.log('sample solution: ' + sampleSolution);
        console.log('user solution: ');
        for (const element of this.htmlInputElements) {
            console.log(element.value);
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
                this.htmlFeedbackElement.innerHTML =
                    '&nbsp;&nbsp;<i class="fas fa-question"></i>';
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
                inputElement.addEventListener('keyup', () => {
                    this.evaluate();
                });
                // "+"
                tmpElement = document.createElement('span');
                tmpElement.innerHTML = '\\(+\\)';
                this.htmlElement.appendChild(tmpElement);
                // imaginary part
                inputElement = document.createElement('input');
                this.htmlInputElements.push(inputElement);
                this.htmlElement.appendChild(inputElement);
                inputElement.type = 'text';
                inputElement.classList.add('mx-1');
                inputElement.placeholder = '';
                inputElement.size = 5;
                inputElement.addEventListener('keyup', () => {
                    this.evaluate();
                });
                // "i"
                tmpElement = document.createElement('span');
                tmpElement.innerHTML = '\\(i\\)';
                this.htmlElement.appendChild(tmpElement);
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML =
                    '&nbsp;&nbsp;<i class="fas fa-question"></i>';
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

class PartQuestion extends Part {
    text = '';
    options: string[] = [];
    variables: QuestionVariable[] = [];
    inputFields: QuestionInputField[] = [];
    variantIdx = 0; // TODO: random!
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
    generate(rootElement: HTMLElement): void {
        let text = this.text;
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
        for (let i = 0; i < this.inputFields.length; i++) {
            text = text.replace(
                '$' + i + '$',
                '<span id="' + this.getHtmlElementIdx(i) + '"></span>',
            );
        }

        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid', 'my-1');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        divContainer.style.borderLeftStyle = 'solid';
        divContainer.style.borderRightStyle = 'solid';
        divContainer.style.borderWidth = '8px';
        divContainer.style.borderColor = '#0000aa';
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1');
        divRow.appendChild(divCol);
        const headline = document.createElement('p');
        headline.classList.add('text-start', 'lead', 'py-0', 'my-0', 'my-1');
        headline.innerHTML = '<b>Aufgabe</b>';
        divCol.appendChild(headline);
        const textElement = document.createElement('p');
        textElement.innerHTML = text;
        divCol.appendChild(textElement);

        this.generateInputElements();
    }

    import(data: any): void {
        this.text = data['text'];
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

class SpeedReviewQuestion {
    text = '';
    answers: string[] = [];
}

class PartSpeedReview extends Part {
    htmlElement: HTMLElement = null;
    questions: SpeedReviewQuestion[] = [];
    generate(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid', 'my-1');
        divContainer.style.backgroundColor = '#ffffff';
        //divContainer.style.cursor = 'pointer';
        divContainer.style.borderLeftStyle = 'solid';
        divContainer.style.borderRightStyle = 'solid';
        divContainer.style.borderWidth = '8px';
        divContainer.style.borderColor = '#00aa00';
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1');
        divRow.appendChild(divCol);
        const headline = document.createElement('p');
        headline.classList.add('text-start', 'lead', 'py-0', 'my-0', 'my-1');
        headline.innerHTML = '<b>Speed Review</b>';
        divCol.appendChild(headline);
        this.htmlElement = document.createElement('p');
        this.htmlElement.classList.add('text-center');
        this.htmlElement.innerHTML =
            '<span style="font-size: 48pt"><i class="fas fa-play-circle"></i></span>';
        divCol.appendChild(this.htmlElement);
        divCol.addEventListener('click', () => {
            const q = this.questions[1]; // TODO
            this.htmlElement.innerHTML =
                `
                <div class="row py-0">
                    <div class="col text-center py-0">
                        <p class="lead py-0">` +
                q.text +
                `</p>
                    </div>
                </div>
                <div class="row mx-2 my-2" style="height:50px;">
                    <div class="col bg-dark text-light rounded mx-2"><br/>
                        ` +
                q.answers[0] +
                `
                    </div>
                    <div class="col bg-dark text-light rounded mx-2"><br/>
                        ` +
                q.answers[1] +
                `
                    </div>
                </div>
                <div class="row mx-2 my-2" style="height:50px;">
                    <div class="col bg-dark text-light rounded mx-2"><br/>
                        ` +
                q.answers[2] +
                `
                    </div>
                    <div class="col bg-dark text-light rounded mx-2"><br/>
                        ` +
                q.answers[3] +
                `
                    </div>
                </div>
            `;
        });
    }
    import(data: any): void {
        for (const q of data['questions']) {
            const questionInstance = new SpeedReviewQuestion();
            this.questions.push(questionInstance);
            questionInstance.text = q['text'];
            for (const a of q['answers']) {
                questionInstance.answers.push(a);
            }
        }
    }
}

class LinkEntry {
    title = '';
    ref = '';
}

class PartLinks extends Part {
    links: LinkEntry[] = [];
    generate(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        rootElement.appendChild(divContainer);
        for (const link of this.links) {
            const divRow = document.createElement('div');
            divContainer.appendChild(divRow);
            divRow.classList.add('row');
            const divCol = document.createElement('div');
            divRow.appendChild(divCol);
            divCol.classList.add('col', 'my-1', 'text-center');
            const button = document.createElement('button');
            divCol.appendChild(button);
            button.type = 'button';
            button.classList.add('btn', 'btn-sm', 'btn-dark');
            button.innerHTML = link.title;
        }
    }
    import(data: any): void {
        for (const l of data['links']) {
            const linkInstance = new LinkEntry();
            this.links.push(linkInstance);
            linkInstance.title = l['title'];
            linkInstance.ref = l['ref'];
        }
    }
}

class CoursePage {
    private title = '';
    private parts: Part[] = [];
    private textProgress = 0;

    set(): void {
        const content = document.getElementById('content');
        // title
        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        content.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1');
        divRow.appendChild(divCol);
        divCol.innerHTML = '<h1>' + this.title + '</h1>';
        // parts
        for (const part of this.parts) {
            part.generate(content);
        }
        // progress bars
        this.refreshProgressBars();
    }

    import(json: any): void {
        this.title = json['title'];
        for (const part of json['parts']) {
            let partInstance = null;
            switch (part['type']) {
                case 'headline-1':
                    partInstance = new PartHeadline(this);
                    partInstance.import(part);
                    break;
                case 'paragraph':
                    partInstance = new PartParagraph(this);
                    partInstance.import(part);
                    break;
                case 'definition':
                    partInstance = new PartDefinition(this);
                    partInstance.import(part);
                    break;
                case 'example':
                    partInstance = new PartExample(this);
                    partInstance.import(part);
                    break;
                case 'question':
                    partInstance = new PartQuestion(this);
                    partInstance.import(part);
                    break;
                case 'speed-review':
                    partInstance = new PartSpeedReview(this);
                    partInstance.import(part);
                    break;
                case 'links':
                    partInstance = new PartLinks(this);
                    partInstance.import(part);
                    break;
                default:
                    console.assert(
                        false,
                        'unimplemented part type ' + part['type'],
                    );
            }
            this.parts.push(partInstance);
        }
        const bp = 1337;
    }

    refreshProgressBars(): void {
        let numTextPartsTotal = 0;
        let numTextPartsRead = 0;
        for (const part of this.parts) {
            if (
                part instanceof PartParagraph ||
                part instanceof PartDefinition ||
                part instanceof PartExample
            ) {
                numTextPartsTotal++;
                numTextPartsRead += part.readFlag ? 1 : 0;
            }
        }
        this.textProgress = Math.round(
            (100 * numTextPartsRead) / numTextPartsTotal,
        );
        const div = document.getElementById('progress-bars');
        div.innerHTML =
            `
        <div id="text-progress" class="progress">
            <div class="progress-bar bg-dark" role="progressbar" style="width: ` +
            this.textProgress +
            `%" aria-valuenow="` +
            this.textProgress +
            `" aria-valuemin="0" aria-valuemax="100">Text</div>
        </div>
        <div class="progress">
            <div class="progress-bar bg-primary" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">Aufgaben</div>
        </div>
        <div class="progress">
            <div class="progress-bar bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Spiele</div>
        </div>
        `;
    }
}

const coursePage = new CoursePage();

export function init() {
    loadPage('data/courses/demo/demo-app-complex-1.json');
}

function loadPage(path: string) {
    axios
        .get(path)
        .then(function (response) {
            const data = response.data;
            coursePage.import(data);
            coursePage.set();
        })
        .catch(function (error) {
            console.error(error); // TODO: error handling!
        });
}

/*
import fs from 'fs';
const data = fs.readFileSync(
    'data/courses/demo/demo-app-complex-1.json',
    'utf-8',
);
const page = new CoursePage();
page.import(JSON.parse(data));
*/
