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
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/mode/overlay';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

import { MathJax } from '../shared/mathjax';

import * as strings from './strings';

const mathjaxInstance = new MathJax();

import * as emulatorCoursePage from '../emulator/coursePage';

export let editor: CodeMirror.EditorFromTextArea = null;

export let currentCourseId = '';
export let currentCourseName = '';
export let currentDocumentId = '';
export let currentDocumentName = '';

let mobileMode = false;

export function setMobileMode() {
    mobileMode = true;
    updateEmulator();
}

export function setDesktopMode() {
    mobileMode = false;
    updateEmulator();
}

export const toggle_states: { [key: string]: boolean } = {
    'preview-spell-check': false,
    'preview-show-source-links': true,
    'preview-show-solutions': false,
    'preview-show-variables': false,
    'preview-show-export': false,
};

export function loadDocument() {
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'get_document',
                    query_values: {
                        id: currentDocumentId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            console.log(data);
            editor.setValue(data.rows[0][3]);
            updateEmulator();
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function saveDocument() {
    if (currentCourseId == '') return;
    // TODO: create document backup
    const sourceCode = editor.getValue();
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'save_document',
                    query_values: {
                        id: currentDocumentId,
                        text: sourceCode,
                    },
                }),
            }),
        )
        .then(function (response) {
            // TODO: check data.error
            console.log(response.data);
            console.log('saved successfully');
        })
        .catch(function (error) {
            // TODO
            console.log(error);
            console.log('saving failed');
        });
}

export function refreshDocumentList() {
    const documentListButton = document.getElementById('filelist_button');
    const documentListDropdownItems = document.getElementById(
        'filelist_dropdown_items',
    );
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'get_document_list',
                    query_values: {
                        courseId: currentCourseId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            console.log(response.data);
            let html = '',
                i = 0;
            for (const row of data.rows) {
                const documentId = row[0];
                const documentName = row[1];
                html +=
                    '<li><a class="dropdown-item" style="cursor:pointer;">' +
                    documentName +
                    '</a></li>';
                if (i == 0) {
                    currentDocumentId = documentId;
                    currentDocumentName = documentName;
                }
                i++;
            }
            documentListDropdownItems.innerHTML = html;
            documentListButton.innerHTML = currentDocumentName;
            loadDocument();
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function refreshCourseList() {
    const courselistButton = document.getElementById('courselist_button');
    const courselistDropdownItems = document.getElementById(
        'courselist_dropdown_items',
    );

    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'get_course_list',
                    query_values: {},
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            console.log(response.data);
            let html = '',
                i = 0;
            for (const row of data.rows) {
                const courseId = row[0];
                const courseName = row[1];
                html +=
                    '<li><a class="dropdown-item" style="cursor:pointer;">' +
                    courseName +
                    '</a></li>';
                if (i == 0) {
                    currentCourseId = courseId;
                    currentCourseName = courseName;
                }
                i++;
            }
            courselistDropdownItems.innerHTML = html;
            courselistButton.innerHTML = currentCourseName;
            refreshDocumentList();
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function init() {
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'check_system',
                }),
            }),
        )
        .then(function (response) {
            let data = response.data;
            if (data.includes('NOT INSTALLED')) {
                const renderedContentElement =
                    document.getElementById('rendered-content');
                data = data.replace(/\n/g, '<br/>');
                renderedContentElement.innerHTML =
                    '<p class="text-danger bg-white">' +
                    '<b>MISSING DEPENDENCIES ON SERVER:</b>' +
                    '<br/><br/>' +
                    data +
                    '<br/>Please reload this page after installation!';
                ('</p>');
            } else init2();
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

function init2() {
    refreshCourseList();

    // init code editor
    CodeMirror.defineSimpleMode('sellquiz-edit', {
        start: [
            { regex: /\$(?:[^\\]|\\.)*?(?:\$|$)/, token: 'string' },
            { regex: /\*\*(?:[^\\]|\\.)*?(?:\*\*|$)/, token: 'variable-3' },
            { regex: /`(?:[^\\]|\\.)*?(?:`)/, token: 'string' },
            { regex: /%.*/, token: 'comment' },
            { regex: /#.*/, token: 'keyword', sol: true },
            {
                regex: /---|========|Definition\.|Example\.|Theorem\.|Chatquestion\.|Question\.|Remark\.|JavaBlock\.|Python\.|Tikz\.|Speedreview\.|Links\.|Plot2d\.|!tex|@tags|@code|@text|@solution|@given|@asserts|@options|@questions|@forbidden-keywords|@python|@sage|@octave|@maxima|@answer|@required-keywords/,
                token: 'keyword',
            },
        ],
        comment: [],
        meta: {
            dontIndentStates: ['comment'],
            lineComment: '%',
        },
    });

    editor = CodeMirror.fromTextArea(
        document.getElementById('editor') as HTMLTextAreaElement,
        {
            mode: 'sellquiz-edit',
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: {
                nonEmpty: true,
            },
            extraKeys: {
                'Ctrl-S': function () {
                    saveDocument();
                },
                'Cmd-S': function () {
                    saveDocument();
                },
                'Ctrl-F': function () {
                    alert('searching text is unimplemented!');
                },
                'Cmd-F': function () {
                    alert('searching text is unimplemented!');
                },
                F1: function () {
                    updateEmulator(true);
                },
                F2: function () {
                    updateEmulator(false);
                },
                F3: function () {
                    document.getElementById('insertCodeButton').click();
                },
            },
        },
    );
    editor.setSize(null, '100%');

    // populate math symbols
    const symbols = strings.symbols;
    let html = '<table class="p-1">';
    const cols = 16;
    const rows = Math.ceil(symbols.length / cols);
    for (let i = 0; i < rows; i++) {
        html += '<tr>';
        for (let j = 0; j < cols; j++) {
            const idx = i * cols + j;
            if (idx < symbols.length) {
                const onclick =
                    "slw.insertCode(' " +
                    symbols[idx] +
                    " ');slw.editor.focus();";
                html +=
                    '<td class="border border-dark p-1 text-center" style="cursor:pointer;"><a onclick="' +
                    onclick +
                    '"> ` ' +
                    symbols[idx] +
                    ' ` </a></td>';
            } else html += '<td></td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    document.getElementById('math-symbols').innerHTML = html;

    // populate code templates
    const code_templates = [
        'Document Title',
        '\n##### My Title\n',
        'Section',
        '\n# My Section\n',
        'Subsection',
        '\n## My Subsection\n',
        'Subsubsection',
        '\n### My Subsubsection\n',
        'Definition',
        '\n---\nDefinition.\n---\n\n',
        'Theorem',
        '\n---\nTheorem.\n---\n\n',
        'SELL-Quiz',
        '\n---\nSell. My Quiz\n\tx, y in {1,2,3}\n\\tz := x + y\n$ x + y = #z $\n---\n\n',
        'STACK-Quiz',
        '\n---\nStack. My Quiz\n\n@code\nx:random(10)\ny:random(10)\nz:x+y;\n\n@text\n$x+y=#z$\n\n@solution\nJust add both numbers!\n---\n\n',
    ];
    html = '';
    for (let i = 0; i < code_templates.length / 2; i++) {
        const id = code_templates[i * 2 + 0];
        const code = code_templates[i * 2 + 1]
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t');
        html +=
            `<a class="list-group-item list-group-item-action"
                     onclick="slw.insertCode('` +
            code +
            `');"
                     style="cursor:pointer;"
                     >` +
            id +
            `</a>`;
    }
    document.getElementById('insertCodeList').innerHTML = html;
}

/*
 export function jump(lineNo: number) {
     editor.scrollTo(
         null,
         editor.charCoords({ line: lineNo, ch: 0 }, 'local').top,
     );
 }*/

export function insertCode(text: string) {
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
}

export function undoEditor() {
    editor.undo();
}

export function redoEditor() {
    editor.redo();
}

export function updateEmulator(fastUpdate = true) {
    //const sourceCode = editor.getValue();
    const renderedContentElement = document.getElementById('rendered-content');
    renderedContentElement.innerHTML =
        '<div class="col bg-white"><h1>PLEASE WAIT</h1></div>';
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: fastUpdate
                        ? 'compile_document_fast'
                        : 'compile_document',
                    query_values: {
                        documentId: currentDocumentId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            console.log(response.data);
            const doc = new emulatorCoursePage.CoursePage(
                mathjaxInstance,
                false,
            );
            doc.import(data);
            renderedContentElement.innerHTML = '';

            const view = document.createElement('div');
            view.style.backgroundColor = '#FFFFFF';
            renderedContentElement.appendChild(view);
            if (mobileMode) view.style.maxWidth = '480px';
            else view.style.maxWidth = '1024px';

            doc.set(view);
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function toggleButton(buttonName: string) {
    const element = document.getElementById(buttonName);
    toggle_states[buttonName] = !toggle_states[buttonName];
    if (toggle_states[buttonName])
        element.className = 'btn btn-dark mx-0 btn-sm';
    else element.className = 'btn btn-outline-dark mx-0 btn-sm';

    if (buttonName === 'preview-spell-check') {
        /*if (spellInst == null) {
             spellInst = new spell.Spell();
         } else update();*/
        // TODO
    } else if (buttonName === 'preview-show-solutions') {
        updateEmulator();
    } else if (buttonName === 'preview-show-variables') {
        updateEmulator();
    } else if (buttonName === 'preview-show-export') {
        updateEmulator();
    }
}
