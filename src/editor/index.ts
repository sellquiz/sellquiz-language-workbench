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
//import 'codemirror/addon/selection/active-line';  TODO: reactivate??
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/mode/overlay';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

import { MathJax } from '../shared/mathjax';

import * as strings from './strings';

const mathjaxInstance = new MathJax();

import * as emulatorCoursePage from '../emulator/coursePage';

export let editor: CodeMirror.EditorFromTextArea = null;

export let currentServerId = '';
export let currentServerName = '';
export let currentCourseId = '';
export let currentCourseName = '';
export let currentDocumentId = '';
export let currentDocumentName = '';

let editDocumentFormElement: HTMLElement = null;
let editDocumentOrderElement: HTMLInputElement = null;
let editDocumentNameElement: HTMLInputElement = null;
let editDocumentDescriptionElement: HTMLInputElement = null;

let editorLastSavedText = '';

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
    'preview-show-score': false,
    'preview-show-export': false,
};

function isID(id: string, allowHyphen = true): boolean {
    for (let i = 0; i < id.length; i++) {
        if (id[i] === '_') continue;
        if (id[i] === '-') continue;
        if (id[i] >= 'A' && id[i] <= 'Z') continue;
        if (id[i] >= 'a' && id[i] <= 'z') continue;
        if (i > 0 && id[i] >= '0' && id[i] <= '6') continue;
        return false;
    }
    return true;
}

export function deleteDocument(id: number) {
    // TODO: yes/no dialog!!
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'delete_document',
                    query_values: {
                        id: id,
                        courseId: currentCourseId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            console.log(data);

            refreshDocumentList();
            refreshDocumentManagement();
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function createDocument() {
    const order = <HTMLInputElement>(
        document.getElementById('createDocumentModalOrder')
    );
    const name = <HTMLInputElement>(
        document.getElementById('createDocumentModalId')
    );
    const desc = <HTMLInputElement>(
        document.getElementById('createDocumentModalDesc')
    );

    // TODO: check, if order is a number
    let orderValue = order.value;
    const nameValue = name.value;
    const descValue = desc.value;
    if (orderValue.length == 0) orderValue = '0';
    if (isID(nameValue) == false) {
        alert('invalid ID!!'); // TODO: better message; alerts are bad practice!!
        return;
    }
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'create_document',
                    query_values: {
                        name: nameValue,
                        order: orderValue,
                        desc: descValue,
                        courseId: currentCourseId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            console.log(data);

            name.value = '';
            order.value = '';
            desc.value = '';

            refreshDocumentList();
            refreshDocumentManagement();
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function loadDocument(documentId: string) {
    if (editor.getValue() !== editorLastSavedText) {
        alert('unsaved changes!!!!!');
    }
    currentDocumentId = documentId;
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'get_document',
                    query_values: {
                        id: documentId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            //console.log(data);

            currentDocumentName = data.rows[0][2];
            const documentListButton =
                document.getElementById('filelist_button');
            documentListButton.innerHTML = currentDocumentName;

            let text = data.rows[0][4];
            text = text.replace(/\r/g, ''); // remove Windows carriage return
            editor.setValue(text);
            editorLastSavedText = text;

            /*TODO: mark all blocks between --- and ---
            const markers = [];
            markers.push(
                editor.markText(
                    { line: 6, ch: 0 },
                    { line: 14, ch: 0 },
                    {
                        css: 'background-color: #EEEEFF',
                        inclusiveLeft: true,
                        inclusiveRight: true,
                    },
                ),
            );
            markers.push(
                editor.markText(
                    { line: 23, ch: 0 },
                    { line: 38, ch: 0 },
                    {
                        css: 'background-color: #E2E2E2',
                        inclusiveLeft: true,
                        inclusiveRight: true,
                    },
                ),
            );
            //markers.forEach((marker) => marker.clear());
            */

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
            editorLastSavedText = sourceCode;
            console.log(response.data);
            console.log('saved successfully');
        })
        .catch(function (error) {
            // TODO
            console.log(error);
            console.log('saving failed');
        });
}

export function refreshServerList() {
    const serverListButton = document.getElementById('serverlist_button');
    const serverListDropdownItems = document.getElementById(
        'serverlist_dropdown_items',
    );
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'get_server_list',
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
                const serverId = row[0];
                const serverName = row[1];
                html +=
                    '<li><a class="dropdown-item" style="cursor:pointer;">' +
                    serverName +
                    '</a></li>';
                if (i == 0) {
                    currentServerId = serverId;
                    currentServerName = serverName;
                }
                i++;
            }
            serverListDropdownItems.innerHTML = html;
            serverListButton.innerHTML = currentServerName;
        })
        .catch(function (error) {
            // TODO
            console.log(error);
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
                const documentName = row[2];
                html +=
                    '<li><a class="dropdown-item" style="cursor:pointer;"' +
                    ' onclick="slwEditor.loadDocument(' +
                    documentId +
                    ');">' +
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
            loadDocument(currentDocumentId);
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function refreshDocumentManagement() {
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

            document.getElementById(
                'document-management-selected-course',
            ).innerHTML = currentCourseName;
            const tableBody = document.getElementById(
                'document-management-list',
            );

            let html = '';
            for (const row of response.data.rows) {
                html += '<tr>';
                html += '<td>' + row[1] + '</td>'; // order
                html += '<td>' + row[2] + '</td>'; // name
                html += '<td>' + row[3] + '</td>'; // description
                html += '<td>' + row[7] + '</td>'; // state
                const dateCreated = new Date(row[5] * 1000);
                html +=
                    '<td>' +
                    dateCreated.toLocaleDateString() +
                    ' ' +
                    dateCreated.toLocaleTimeString() +
                    '</td>';
                const dateModified = new Date(row[6] * 1000);
                html +=
                    '<td>' +
                    dateModified.toLocaleDateString() +
                    ' ' +
                    dateModified.toLocaleTimeString() +
                    '</td>';
                html +=
                    `
                <td>
                    <button type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="edit"
                        onclick="slwEditor.editDocumentMetadata(` +
                    row[0] +
                    `)">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button"
                        class="btn btn-primary btn-sm"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="delete"
                        onclick="slwEditor.deleteDocument(` +
                    row[0] +
                    `);"
                        >
                        <i class="fas fa-trash"></i>
                    </button>
                </td>`;
                html += '</tr>';
            }

            tableBody.innerHTML = html;
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

let editDocumentId = -1;

export function editDocumentMetadata(documentId: number) {
    editDocumentId = documentId;
    editDocumentFormElement.style.display = 'block';
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'get_document',
                    query_values: {
                        id: documentId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            //console.log(response.data);
            editDocumentOrderElement.value = data.rows[0][1];
            editDocumentNameElement.value = data.rows[0][2];
            editDocumentDescriptionElement.value = data.rows[0][3];
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function saveDocumentMetadata() {
    const order = editDocumentOrderElement.value; // TODO: check validity
    const name = editDocumentNameElement.value; // TODO: check validity
    const description = editDocumentDescriptionElement.value;
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'change_document_metadata',
                    query_values: {
                        id: editDocumentId,
                        order: order,
                        name: name,
                        description: description,
                        modified: Math.floor(Date.now() / 1000),
                    },
                }),
            }),
        )
        .then(function (response) {
            //const data = response.data;
            // TODO: check data.error
            //console.log(response.data);
            editDocumentFormElement.style.display = 'none';
            editDocumentId = -1;
            refreshDocumentManagement();
            refreshDocumentList();
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}
export function cancelEditDocumentMetadata() {
    editDocumentFormElement.style.display = 'none';
    editDocumentId = -1;
}

export function loadCourse(courseId: string) {
    currentCourseId = courseId;
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'get_course',
                    query_values: {
                        id: currentCourseId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            //console.log(data);
            currentCourseName = data.rows[0][1];
            const courseListButton =
                document.getElementById('courselist_button');
            courseListButton.innerHTML = currentCourseName;
            refreshDocumentList();
            refreshDocumentManagement();
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
                    '<li><a class="dropdown-item" style="cursor:pointer;"' +
                    ' onclick="slwEditor.loadCourse(' +
                    courseId +
                    ');">' +
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
    editDocumentFormElement = document.getElementById(
        'document-management-form',
    );
    editDocumentOrderElement = <HTMLInputElement>(
        document.getElementById('document-management-form-order')
    );
    editDocumentNameElement = <HTMLInputElement>(
        document.getElementById('document-management-form-name')
    );
    editDocumentDescriptionElement = <HTMLInputElement>(
        document.getElementById('document-management-form-description')
    );
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
    refreshServerList();
    refreshCourseList();

    // init code editor
    CodeMirror.defineSimpleMode('sellquiz-edit', {
        start: [
            { regex: /\$(?:[^\\]|\\.)*?(?:\$|$)/, token: 'string' },
            { regex: /\*\*(?:[^\\]|\\.)*?(?:\*\*|$)/, token: 'variable-3' },
            //{ regex: /`(?:[^\\]|\\.)*?(?:`)/, token: 'string' },
            { regex: /%.*/, token: 'comment' },
            { regex: /#.*/, token: 'keyword', sol: true },
            {
                regex: /---|========|Definition\.|Example\.|Theorem\.|Proof\.|Chatquestion\.|Question\.|Remark\.|JavaQuestion\.|Python\.|Authentication\.|Tikz\.|Speedreview\.|Links\.|Plot2d\.|!tex|!lang=EN|!lang=DE|!require-authentication|!require-min-score|@tags|@title|@code|@text|@solution|@given|@asserts|@options|@questions|@forbidden-keywords|@python|@matching|\/\/\/|@settings|@sage|@octave|@maxima|@answer|@database|@input|@required-keywords/,
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
            /*styleActiveLine: {  // TODO: reactivate??
                nonEmpty: true,
            },*/
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
    // TODO: Theorem, Proof
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
        'Multiple Choice Question',
        '\n---\nQuestion.\n@title\nMy Multiple Choice question\n@text\nSelect the correct answers:\n[x] correct answer\n[ ] incorrect answer\n[x] correct answer\n---\n\n',
        'Quiz with random variables (Python-based)',
        '\n---\nQuestion.\n@title\nMy question with random variables (Python)\n@python\nimport random\na = random.randint(0, 25)\nb = random.randint(0, 25)\nc = a + b\n@text\nCalculate $a + b = $ #c\n---\n\n',
        'Quiz with random variables (SageMath-based)',
        '\n---\nQuestion.\n@title\nMy question with random variables (Sage Math)\n@sage\na = randint(1, 10);\nb = randint(1, 10);\nc = a + b;\n@text\nCalculate $a + b = $ #c\n---\n\n',
    ];
    html = '';
    for (let i = 0; i < code_templates.length / 2; i++) {
        const id = code_templates[i * 2 + 0];
        const code = code_templates[i * 2 + 1]
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t');
        html +=
            `<a class="list-group-item list-group-item-action"
                     onclick="slwEditor.insertCode('` +
            code +
            `');"
                     style="cursor:pointer;"
                     >` +
            id +
            `</a>`;
    }
    document.getElementById('insertCodeList').innerHTML = html;
}

export function jumpToSourceCodeLine(lineNo: number) {
    editor.scrollTo(
        null,
        editor.charCoords({ line: lineNo - 1, ch: 0 }, 'local').top,
    );
}

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
            const doc = new emulatorCoursePage.CoursePage(mathjaxInstance, {
                renderProgressBars: false,
                showQuestionVariables: toggle_states['preview-show-variables'],
                showQuestionScore: toggle_states['preview-show-score'],
                showSolution: toggle_states['preview-show-solutions'],
                showSourceCodeLinks: toggle_states['preview-show-source-links'],
            });
            doc.import(data);
            renderedContentElement.innerHTML = '';

            const viewRow = document.createElement('div');
            viewRow.classList.add(
                'row',
                'justify-content-md-center',
                'p-0',
                'm-0',
            );
            renderedContentElement.appendChild(viewRow);

            const viewCol = document.createElement('div');
            viewCol.classList.add(
                'col',
                'border',
                'border-dark',
                'rounded',
                'my-2',
            );
            viewCol.style.backgroundColor = '#FFFFFF';
            viewRow.appendChild(viewCol);

            if (mobileMode) viewCol.style.maxWidth = '480px';
            else viewCol.style.maxWidth = '1024px';

            doc.set(viewCol);
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function publish() {
    if (currentServerId == '') return; // TODO: show error
    if (currentDocumentId == '') return; // TODO: show error
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'publish_document',
                    query_values: {
                        serverName: currentServerName,
                        documentId: currentDocumentId,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            console.log(response.data);
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

export function visitServer() {
    if (currentServerId == '') return; // TODO: show error
    const server = currentServerName;
    const course = currentCourseName;
    const document = currentDocumentName;

    const id = window.btoa(server + '#' + course + '#' + document);
    window.open('emulator.php?id=' + encodeURIComponent(id), '_blank').focus();

    /*window
        .open(
            'emulator.php?server=' +
                encodeURIComponent(server) +
                '&course=' +
                encodeURIComponent(course) +
                '&document=' +
                encodeURIComponent(document),
            '_blank',
        )
        .focus();*/
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
    } else if (buttonName === 'preview-show-source-links') {
        updateEmulator();
    } else if (buttonName === 'preview-show-solutions') {
        updateEmulator();
    } else if (buttonName === 'preview-show-variables') {
        updateEmulator();
    } else if (buttonName === 'preview-show-score') {
        updateEmulator();
    } else if (buttonName === 'preview-show-export') {
        updateEmulator();
    }
}
