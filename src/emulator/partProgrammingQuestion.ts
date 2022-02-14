/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import 'codemirror/mode/clike/clike';
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/mode/overlay';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

import { Part } from './part';

export class PartProgrammingQuestion extends Part {
    type = '';
    questionText = '';
    solutionText = '';
    editor: CodeMirror.EditorFromTextArea = null;

    generateDOM(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
        divContainer.classList.add('container-fluid');
        rootElement.appendChild(divContainer);
        // question text
        const questionText = this.questionText;
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-0');
        divRow.appendChild(divCol);
        const headline = document.createElement('p');
        headline.classList.add(
            'text-start',
            'lead',
            'py-0',
            'my-0',
            'my-1',
            'text-light',
            'rounded',
        );
        let typeStr = '';
        switch (this.type) {
            case 'JavaProgram':
                typeStr = 'Java-Programm';
                break;
            default:
                typeStr = 'UNIMPLEMENTED STRING';
                break;
        }
        headline.innerHTML =
            '&nbsp;<b>Programmier-Aufgabe (' + typeStr + ')</b>';
        headline.style.backgroundColor = '#e85b22';
        divCol.appendChild(headline);
        const textElement = document.createElement('p');
        textElement.classList.add('px-1', 'py-0', 'my-0');
        if (this.error) {
            textElement.innerHTML = '<pre>' + this.errorLog + '</pre>';
        } else textElement.innerHTML = questionText;
        divCol.appendChild(textElement);
        //this.addReadEventListener(divContainer);
        // editor
        const textareaBorder = document.createElement('div');
        textareaBorder.classList.add('border', 'p-0', 'm-0');
        divContainer.appendChild(textareaBorder);
        const textarea = document.createElement('textarea');
        textarea.classList.add('form-control', 'p-0');
        textareaBorder.appendChild(textarea);
        this.editor = CodeMirror.fromTextArea(textarea, {
            mode: 'text/x-java',
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: {
                nonEmpty: true,
            },
        });
        this.editor.setSize(null, '100%');
        textarea.rows = 8;
        textareaBorder.style.minHeight = '256px';
        textareaBorder.style.height = '256px';
        // save button
        const button = document.createElement('button');
        button.type = 'button';
        divContainer.appendChild(button);
        button.classList.add('btn', 'btn-primary', 'my-1');
        button.innerHTML = 'Speichern';
    }

    import(data: any): void {
        this.type = data['programming-type'];
        this.questionText = data['text'];
        this.error = data['error'];
        this.errorLog = data['errorLog'];
        if ('solution' in data) {
            this.solutionText = data['solution'];
        }
    }
}
