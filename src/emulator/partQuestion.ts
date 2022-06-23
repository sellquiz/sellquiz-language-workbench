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
    Set = 'set',
    Unknown = 'unknown',
}

export class QuestionVariable {
    id = '';
    type: QuestionVariableType;
    text = '';
    values: string[] = []; // index k represents variant k
    rows = 1; // only used if type == QuestionVariableType.Matrix
    cols = 1; // only used if type == QuestionVariableType.Matrix
    entries = 1; // only used if type == QuestionVariableType.Set
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
            case QuestionVariableType.Matrix:
                // convert e.g. "[[1,2], [3,4]]"
                //   to "\begin{pmatrix}A11 & 2 & 3\\ a & b & c\end{pmatrix}"
                // 1.) "], [" -> "\\ "
                s = value.replace(/\], \[/g, '\\\\ ');
                // 2.)  "," -> " & "
                s = s.replace(/,/g, ' & ');
                // 3.)  "[" -> ""
                s = s.replace(/\[/g, '');
                // 4.)  "]" -> ""
                s = s.replace(/\]/g, '');
                s = '\\begin{pmatrix}' + s + '\\end{pmatrix}';
                break;
            case QuestionVariableType.Set:
                s = value.replace('{', '\\{').replace('}', '\\}');
                break;
            default:
                /*console.assert(
                    false,
                    'unimplemented QuestionVariable.toLaTex(..) for type ' +
                        this.type,
                );*/
                s = '{UNSUPPORTED:' + this.type + '}';
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
            case QuestionVariableType.Matrix:
                return mathjs.evaluate(value);
            case QuestionVariableType.Set:
                // internally stored as vector, since mathjs cannot handle sets
                return mathjs.evaluate(
                    value.replace(/{/g, '[').replace(/}/g, ']'),
                );
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
    Matrix = 'matrix',
    Set = 'set',
    Unknown = 'unknown',
}

export class QuestionInputField {
    question: PartQuestion;
    type: QuestionInputFieldType;
    answerVariable: QuestionVariable = null;
    htmlElement: HTMLElement = null; // root
    htmlInputElements: HTMLInputElement[] = []; // input elements
    htmlFeedbackElement: HTMLElement = null;
    correct = false;
    rows = 1; // only used, if type == QuestionInputFieldType.Matrix
    cols = 1; // only used, if type == QuestionInputFieldType.Matrix
    entries = 1; // only used, if type == QuestionInputFieldType.Set
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
        let matrix: mathjs.MathType;
        let vector: number[] = [];
        let hint = '';

        switch (this.answerVariable.type) {
            case QuestionVariableType.Bool:
                ok =
                    sampleSolution ==
                    parseInt(inputStrings[0].replace(',', '.'));
                break;
            case QuestionVariableType.Int:
            case QuestionVariableType.Float:
                ok =
                    mathjs.abs(
                        <number>(
                            mathjs.subtract(
                                <number>sampleSolution,
                                <mathjs.MathType>(
                                    parseFloat(
                                        inputStrings[0].replace(',', '.'),
                                    )
                                ),
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
                                    parseFloat(
                                        inputStrings[0].replace(',', '.'),
                                    ),
                                    parseFloat(
                                        inputStrings[1].replace(',', '.'),
                                    ),
                                ),
                            )
                        ),
                    ) < 1e-6; // TODO: configure precision
                break;
            case QuestionVariableType.Matrix:
                // construct user matrix
                matrix = mathjs.zeros(this.rows, this.cols);
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++) {
                        const k = i * this.cols + j;
                        let value = parseFloat(
                            inputStrings[k].replace(',', '.'),
                        );
                        if (isNaN(value)) value = 1e12; // pseudo answer
                        (<mathjs.Matrix>matrix).subset(
                            mathjs.index(i, j),
                            value,
                        );
                    }
                }
                // compare
                ok = true;
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++) {
                        const user = (<mathjs.Matrix>matrix).subset(
                            mathjs.index(i, j),
                        );
                        const sample = (<mathjs.Matrix>sampleSolution).subset(
                            mathjs.index(i, j),
                        );
                        //alert(user);
                        //alert(sample);
                        if (Math.abs(<any>user - <any>sample) > 1e-5) {
                            // TODO: precision
                            ok = false;
                            if (this.rows == 1)
                                hint =
                                    ' <span style="color:red;">Tipp: Eintrag ' +
                                    (j + 1) +
                                    ' anschauen</span> ';
                            else
                                hint =
                                    ' <span style="color:red;">Tipp: Eintrag (' +
                                    (i + 1) +
                                    ', ' +
                                    (j + 1) +
                                    ') anschauen</span> ';
                            break;
                        }
                    }
                    if (!ok) break;
                }
                break;
            case QuestionVariableType.Set:
                ok = true;
                // construct user vector
                vector = [];
                for (let i = 0; i < this.entries; i++) {
                    let value = parseFloat(inputStrings[i].replace(',', '.'));
                    if (isNaN(value)) value = 1e12; // pseudo answer
                    vector.push(value);
                }
                // compare
                for (let i = 0; i < this.entries; i++) {
                    const sample = (<mathjs.Matrix>sampleSolution).subset(
                        mathjs.index(i),
                    );
                    let found = false;
                    for (let j = 0; j < this.entries; j++) {
                        const user = vector[j];
                        if (Math.abs(<any>user - <any>sample) < 1e-5) {
                            // TODO: precision
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        ok = false;
                        break;
                    }
                    if (!ok) break;
                }
                /*TODO: hint if (!ok) {
                    hint +=
                        ' <span style="color:red;">Tipp: Eingabe an Stelle ' +
                        (i + 1) +
                        ' ist falsch</span> ';
                }*/
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
                '&nbsp;' + (ok ? CHECK_MARK : CHECK_CROSS) + ' ' + hint;
        }
    }
    createHtmlElement(): void {
        this.htmlElement = document.createElement('span');
        let tmpElement: HTMLElement,
            table: HTMLTableElement,
            tableRow: HTMLTableRowElement,
            tableCell: HTMLTableCellElement;
        let inputElement: HTMLInputElement;
        switch (this.type) {
            case QuestionInputFieldType.CheckBox:
                inputElement = document.createElement('input');
                this.htmlInputElements.push(inputElement);
                this.htmlElement.appendChild(inputElement);
                if (this.question.isSingleChoice) inputElement.type = 'radio';
                else inputElement.type = 'checkbox';
                inputElement.name = 'button_group_' + this.question.uniqueId;
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML = ''; // TODO
                this.htmlElement.appendChild(this.htmlFeedbackElement);
                break;
            case QuestionInputFieldType.TextField:
                inputElement = document.createElement('input');
                this.htmlInputElements.push(inputElement);
                this.htmlElement.appendChild(inputElement);
                inputElement.type = 'text';
                inputElement.classList.add('mx-1', 'my-1');
                inputElement.placeholder = '';
                inputElement.size = 5;
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML = ''; // TODO
                this.htmlElement.appendChild(this.htmlFeedbackElement);
                break;
            case QuestionInputFieldType.ComplexNormalform:
                // real part
                inputElement = document.createElement('input');
                this.htmlInputElements.push(inputElement);
                this.htmlElement.appendChild(inputElement);
                inputElement.type = 'text';
                inputElement.classList.add('mx-1', 'my-1');
                inputElement.placeholder = '';
                inputElement.size = 5;
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
                inputElement.classList.add('mx-1', 'my-1');
                inputElement.placeholder = '';
                inputElement.size = 5;
                // "i"
                tmpElement = document.createElement('span');
                tmpElement.innerHTML = this.question.coursePage
                    .getMathJaxInst()
                    .convertHTML('\\(i\\)');
                this.htmlElement.appendChild(tmpElement);
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML = ''; // TODO
                this.htmlElement.appendChild(this.htmlFeedbackElement);
                break;
            case QuestionInputFieldType.Matrix:
                table = document.createElement('table');
                //table.style.display = 'inline-table';
                table.style.borderSpacing = '0';
                table.style.borderCollapse = 'collapse';
                table.style.borderLeft = '2px solid black';
                table.style.borderRight = '2px solid black';
                this.htmlElement.appendChild(table);
                for (let i = 0; i < this.rows; i++) {
                    tableRow = document.createElement('tr');
                    table.appendChild(tableRow);
                    // insert a column for left parenthesis of matrix
                    tableCell = document.createElement('td');
                    tableCell.innerHTML = ' ';
                    if (i == 0) tableCell.style.borderTop = '2px solid black';
                    if (i == this.rows - 1)
                        tableCell.style.borderBottom = '2px solid black';
                    tableRow.appendChild(tableCell);
                    // content
                    for (let j = 0; j < this.cols; j++) {
                        tableCell = document.createElement('td');
                        tableRow.appendChild(tableCell);
                        inputElement = document.createElement('input');
                        this.htmlInputElements.push(inputElement);
                        tableCell.appendChild(inputElement);
                        inputElement.type = 'text';
                        inputElement.classList.add('mx-0', 'my-0');
                        inputElement.placeholder = '';
                        inputElement.size = 2;
                    }
                    // insert a column for right parenthesis of matrix
                    tableCell = document.createElement('td');
                    tableCell.innerHTML = ' ';
                    if (i == 0) tableCell.style.borderTop = '2px solid black';
                    if (i == this.rows - 1)
                        tableCell.style.borderBottom = '2px solid black';
                    tableRow.appendChild(tableCell);
                }
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML = ''; // TODO
                this.htmlElement.appendChild(this.htmlFeedbackElement);
                break;
            case QuestionInputFieldType.Set:
                // "{"
                tmpElement = document.createElement('span');
                tmpElement.innerHTML = this.question.coursePage
                    .getMathJaxInst()
                    .convertHTML('{');
                this.htmlElement.appendChild(tmpElement);
                // elements
                for (let i = 0; i < this.entries; i++) {
                    if (i > 0) {
                        // ","
                        tmpElement = document.createElement('span');
                        tmpElement.innerHTML = this.question.coursePage
                            .getMathJaxInst()
                            .convertHTML(',');
                        this.htmlElement.appendChild(tmpElement);
                    }
                    // input bot
                    inputElement = document.createElement('input');
                    this.htmlInputElements.push(inputElement);
                    this.htmlElement.appendChild(inputElement);
                    inputElement.type = 'text';
                    inputElement.classList.add('mx-1', 'my-1');
                    inputElement.placeholder = '';
                    inputElement.size = 3;
                }
                // "}"
                tmpElement = document.createElement('span');
                tmpElement.innerHTML = this.question.coursePage
                    .getMathJaxInst()
                    .convertHTML('}');
                this.htmlElement.appendChild(tmpElement);
                // feedback
                this.htmlFeedbackElement = document.createElement('span');
                this.htmlFeedbackElement.innerHTML = ''; // TODO
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
    isPseudoQuestion = false; // If true, then question has NO evaluate button

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

    isSingleChoice = false; // only used, if variables starting with 'mc__'
    // exists (these are used for both multiple-choice and single-choice
    // questions)

    uniqueId = ''; // used to name single-choice button groups

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
            // multiple choice and single choice
            if (text.includes('?mc?') || text.includes('?sc?')) {
                this.isSingleChoice = text.includes('?sc?');
                // multiple choice and single choice
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
                if (this.isSingleChoice) text = text.replace('?sc?', mcStr);
                else text = text.replace('?mc?', mcStr);
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

        if (this.error) return;

        //this.addReadEventListener(divContainer);
        this.generateInputElements();
        // variable values
        if (this.showVariables) {
            let variableValues = '';
            for (const v of this.variables) {
                variableValues +=
                    v.id + '=' + v.toMathJs(this.variantIdx) + ', &nbsp;';
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
        if (this.isPseudoQuestion == false) {
            const button = document.createElement('button');
            button.type = 'button';
            divCol.appendChild(button);
            button.classList.add('btn', 'btn-primary', 'btn-sm', 'my-1');
            button.innerHTML =
                this.coursePage.getLanguage() === 'DE' ? 'Auswerten' : 'Check';
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
        }
        // feedback element
        this.htmlFeedbackElement = document.createElement('span');
        this.htmlFeedbackElement.classList.add('mx-3');
        this.htmlFeedbackElement.innerHTML = '';
        divCol.appendChild(this.htmlFeedbackElement);
        // spacing
        divContainer.appendChild(document.createElement('br'));
    }

    import(data: any): void {
        this.uniqueId = data['inputLineNo'];
        this.questionText = data['text'];
        this.error = data['error'];
        this.errorLog = data['errorLog'];
        this.title = data['title'];
        if ('is-pseudo-question' in data) {
            this.isPseudoQuestion = data['is-pseudo-question'];
        }
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
            switch (typeStr.split(':')[0]) {
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
                case 'matrix':
                    variable.type = QuestionVariableType.Matrix;
                    variable.rows = parseInt(typeStr.split(':')[1]);
                    variable.cols = parseInt(typeStr.split(':')[2]);
                    break;
                case 'set':
                    variable.type = QuestionVariableType.Set;
                    variable.entries = parseInt(typeStr.split(':')[1]);
                    break;
                case 'unknown':
                    variable.type = QuestionVariableType.Unknown;
                    this.error = true;
                    this.errorLog +=
                        'variable type of ' +
                        vId +
                        ' is not yet supported<br/>';
                    break;
                default:
                    console.assert(
                        false,
                        'unimplemented variable type ' + typeStr,
                    );
            }
        }
        const numVariants = data['variable-values'].length;
        for (let i = 0; i < numVariants; i++) {
            const variant = data['variable-values'][i];
            for (let j = 0; j < variant.length; j++) {
                const value = variant[j];
                this.variables[j].values.push(value);
            }
        }
        this.variantIdx = Math.floor(Math.random() * numVariants);
        for (let i = 0; i < data['variable-texts'].length; i++) {
            this.variables[i].text = data['variable-texts'][i];
        }
        for (let i = 0; i < data['input-field-types'].length; i++) {
            const inputField = new QuestionInputField(this);
            this.inputFields.push(inputField);
            const inputFieldTypeStr = data['input-field-types'][i];
            switch (inputFieldTypeStr.split(':')[0]) {
                case 'text-field':
                    inputField.type = QuestionInputFieldType.TextField;
                    break;
                case 'complex-normalform':
                    inputField.type = QuestionInputFieldType.ComplexNormalform;
                    break;
                case 'check-box':
                    inputField.type = QuestionInputFieldType.CheckBox;
                    break;
                case 'matrix':
                    inputField.type = QuestionInputFieldType.Matrix;
                    inputField.rows = parseInt(inputFieldTypeStr.split(':')[1]);
                    inputField.cols = parseInt(inputFieldTypeStr.split(':')[2]);
                    break;
                case 'set':
                    inputField.type = QuestionInputFieldType.Set;
                    inputField.entries = parseInt(
                        inputFieldTypeStr.split(':')[1],
                    );
                    break;
                case 'unknown':
                    inputField.type = QuestionInputFieldType.Unknown;
                    this.error = true;
                    this.errorLog +=
                        'input file type of TODO is not yet supported<br/>';
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
