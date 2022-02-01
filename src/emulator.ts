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
import * as mathjs from 'mathjs';

const chatHistory: string[] = ['Wie kann ich Dir helfen?'];
const chatMathScope = {};

export function getChatHistory(): string[] {
    return chatHistory;
}

export function chat(msg: string): void {
    msg = msg.trim();
    chatHistory.push(msg);
    msg = msg.toLowerCase();
    let answer = '';
    try {
        answer = mathjs.evaluate(msg, chatMathScope);
        const tmp = msg.replace('/ /g', ''); // remove spaces
        if (tmp.length > 2 && tmp[1] == '=') answer = 'Merke ich mir!';
    } catch (error) {
        const errStr = error.toString();
        if (errStr.startsWith('Error: Undefined symbol')) {
            const sym = errStr
                .substring('Error: Undefined symbol'.length)
                .trim();
            if (sym.length == 1)
                answer = 'Tut mir leid, ' + sym + ' ist mir nicht bekannt!';
            else {
                // otherwise: non-math symbol
            }
        } else {
            console.log(errStr);
        }
    }
    if (answer.length == 0) {
        if (msg.includes('geht') && msg.endsWith('?'))
            answer = 'Mir geht es gut!';
        else if (msg.includes('normalform'))
            answer =
                'Sei z ∈ C. Dann ist z = x + yi die Normalform von z und x, y ∈ R sind die kartesischen Koordinaten von z.';
        else answer = 'Leider verstehe ich Deine Eingabe nicht.';
    }
    chatHistory.push(answer);
}

abstract class Part {
    coursePage: CoursePage;
    index = 0;
    readFlag = false;
    pageIdx = 0;
    htmlElement: HTMLElement = null; // root
    static indexCounter = 0;
    constructor(coursePage: CoursePage) {
        this.coursePage = coursePage;
        this.index = Part.indexCounter++;
        this.pageIdx = coursePage.getNumPages() - 1;
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
    updateVisibility(): void {
        if (this.htmlElement == null) return;
        if (this.coursePage.getVisiblePageIdx() == this.pageIdx) {
            this.htmlElement.style.display = 'block';
            //console.log('block');
        } else {
            this.htmlElement.style.display = 'none';
            //console.log('none');
        }
    }
}

class PartHeadline extends Part {
    text = '';
    generate(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
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
        this.htmlElement = divContainer;
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

class PartNewPage extends Part {
    generate(): void {
        // empty
    }
    import(data: any): void {
        this.coursePage.incrementNumPages();
    }
}

class PartDefinition extends Part {
    text = '';
    generate(rootElement: HTMLElement): void {
        // TODO: remove duplicate code in "generate" from all parts...
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
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

class PartImage extends Part {
    data = '';
    generate(rootElement: HTMLElement): void {
        const imgElement = document.createElement('img');
        this.htmlElement = imgElement;
        imgElement.src = this.data;
        imgElement.classList.add('img-fluid');
        rootElement.appendChild(imgElement);
    }
    import(data: any): void {
        this.data = data['data'];
    }
}

class PartExample extends Part {
    text = '';
    generate(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
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
    htmlInputElements: HTMLInputElement[] = []; // input elements
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
        this.htmlElement = divContainer;
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
    htmlContentElement: HTMLElement = null;
    questions: SpeedReviewQuestion[] = [];
    generate(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
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
        this.htmlContentElement = document.createElement('p');
        this.htmlContentElement.classList.add('text-center');
        this.htmlContentElement.innerHTML =
            '<span style="font-size: 48pt"><i class="fas fa-play-circle"></i></span>';
        divCol.appendChild(this.htmlContentElement);
        divCol.addEventListener('click', () => {
            const q = this.questions[1]; // TODO
            this.htmlContentElement.innerHTML =
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
        this.htmlElement = divContainer;
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

    private numPages = 1;
    private visiblePageIdx = 0;

    getNumPages(): number {
        return this.numPages;
    }

    getVisiblePageIdx(): number {
        return this.visiblePageIdx;
    }

    incrementNumPages(): void {
        this.numPages++;
    }

    updateVisibility(): void {
        for (const part of this.parts) {
            part.updateVisibility();
        }
    }

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
        // update visibility
        this.updateVisibility();
        // progress bars
        this.refreshProgressBars();
        // navigation

        const nav = document.createElement('div');
        content.appendChild(nav);
        nav.classList.add('text-center');
        nav.appendChild(document.createElement('br'));

        const btnGroup = document.createElement('div');
        nav.appendChild(btnGroup);
        btnGroup.classList.add('btn-group');
        const backwardBtn = document.createElement('button');
        backwardBtn.type = 'button';
        backwardBtn.classList.add('btn', 'btn-outline-primary');
        backwardBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        backwardBtn.addEventListener('click', () => {
            if (this.visiblePageIdx > 0) {
                this.visiblePageIdx--;
                this.updateVisibility();
            }
        });
        btnGroup.appendChild(backwardBtn);
        const forwardBtn = document.createElement('button');
        forwardBtn.type = 'button';
        forwardBtn.classList.add('btn', 'btn-outline-primary');
        forwardBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        forwardBtn.addEventListener('click', () => {
            if (this.visiblePageIdx < this.numPages - 1) {
                this.visiblePageIdx++;
                this.updateVisibility();
            }
        });
        btnGroup.appendChild(forwardBtn);

        nav.appendChild(document.createElement('br'));
        nav.appendChild(document.createElement('br'));
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
                case 'new-page':
                    partInstance = new PartNewPage(this);
                    partInstance.import(part);
                    break;
                case 'definition':
                    partInstance = new PartDefinition(this);
                    partInstance.import(part);
                    break;
                case 'image':
                    partInstance = new PartImage(this);
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
            <div class="progress-bar" role="progressbar" style="width: ` +
            this.textProgress +
            `%; background-color:#cd121b;" aria-valuenow="` +
            this.textProgress +
            `" aria-valuemin="0" aria-valuemax="100">Text</div>
        </div>
        <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: 75%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">Aufgaben</div>
        </div>
        <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: 100%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Spiele</div>
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
