/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2021 TH Köln                                            *
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

import * as codemirror from 'codemirror';
import 'codemirror/addon/selection/active-line';

import * as sellquiz from 'sellquiz';

import * as lang from './lang.js';
import * as compile from './compile.js';

export var editor : codemirror.EditorFromTextArea = null;
export var compilerOutput : compile.CompilerOutput = null;

export var current_course = '';
export var current_file = '';

export var toggle_states= {
    "preview-spell-check": true,
    "preview-show-source-links": true,
    "preview-show-solutions": true,
    "preview-show-variables": true,
    "preview-show-export": true
}

export function refresh_filelist() {
    let filelist_button = document.getElementById("filelist_button");
    let filelist_dropdown_items = document.getElementById("filelist_dropdown_items");
    $.ajax({
        type: "POST",
        url: "services/filelist.php",
        data: {
            course: current_course
        },
        success: function(data) {
            data = JSON.parse(data);
            if(data["status"] === "error")
                alert(data["error_message"]); // TODO
            let html = '', i = 0;
            for(let file of data["file_list"]) {
                html += '<li><a class="dropdown-item" style="cursor:pointer;">' + file + '</a></li>';
                if(i == 0)
                    current_file = file;
                i ++;
            }
            filelist_dropdown_items.innerHTML = html;
            filelist_button.innerHTML = current_file;
        },
        error: function(xhr, status, error) {
            console.error(xhr); // TODO: error handling!
        }
    });
}

export function refresh_courselist() {
    let courselist_button = document.getElementById("courselist_button");
    let courselist_dropdown_items = document.getElementById("courselist_dropdown_items");
    $.ajax({
        type: "POST",
        url: "services/courselist.php",
        data: { },
        success: function(data) {
            data = JSON.parse(data);
            if(data["status"] === "error")
                alert(data["error_message"]); // TODO
            let html = '', i = 0;
            for(let course of data["course_list"]) {
                html += '<li><a class="dropdown-item" style="cursor:pointer;">' + course + '</a></li>';
                if(i == 0)
                    current_course = course;
                i ++;
            }
            courselist_dropdown_items.innerHTML = html;
            courselist_button.innerHTML = current_course;
            refresh_filelist();
        },
        error: function(xhr, status, error) {
            console.error(xhr); // TODO: error handling!
        }
    });
}

export function init() {

    refresh_courselist();
    
    // init code editor

    /*CodeMirrorSpellChecker({ // TODO: activate / deactivate option
        codeMirrorInstance: CodeMirror,
    });*/

    editor = codemirror.fromTextArea(document.getElementById("editor") as HTMLTextAreaElement, {
        //mode: "spell-checker",  // TODO: activate / deactivate option
        mode: "sellquiz-edit",
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: {
            nonEmpty: true
        },
        extraKeys: {
            "Ctrl-S": function(cm) {
                save();
            },
            "Cmd-S": function(cm) {
                save();
            },
            "Ctrl-F": function(cm) {
                alert("searching text is unimplemented!");
            },
            "Cmd-F": function(cm) {
                alert("searching text is unimplemented!");
            },
            "F1": function(cm) {
                update();
            },
            "F2": function(cm) {
                document.getElementById("insertCodeButton").click();
            }
        }
    });
    editor.setSize(null,"100%");

    // populate code templates
    let code_templates = [
        "Document Title", "\n##### My Title\n",
        "Section", "\n# My Section\n",
        "Subsection", "\n## My Subsection\n",
        "Subsubsection", "\n### My Subsubsection\n",
        "Definition", "\n---\nDef.\n---\n\n",
        "Theorem", "\n---\nTheorem.\n---\n\n",
        "SELL-Quiz", "\n---\nSell. My Quiz\n\tx, y in {1,2,3}\n\\tz := x + y\n$ x + y = #z $\n---\n\n",
        "STACK-Quiz", "\n---\nStack. My Quiz\n\n@code\nx:rand(10)\ny:rand(10)\nz:x+y;\n\n@text\n$x+y=#z$\n\n@solution\nJust add both numbers!\n---\n\n",
    ];
    let html = '';
    for(let i=0; i<code_templates.length/2; i++) {
        let id = code_templates[i*2+0];
        let code = code_templates[i*2+1].replaceAll("\n","\\n").replaceAll("\t","\\t");
        html += `<a class="list-group-item list-group-item-action"
                    onclick="slw.insertCode('` + code + `');"
                    style="cursor:pointer;"
                    >` + id + `</a>`;   
    }
    document.getElementById("insertCodeList").innerHTML = html;
    
    // read demo file: TODO: move code!!!!!
    $.ajax({
        type: "POST",
        url: "services/read.php",
        data: {
            course: "demo",  // TODO
            file: "demo"    // TODO
        },
        success: function(data) {
            data = JSON.parse(data);
            if(data["status"] === "error")
                alert(data["error_message"]); // TODO
            editor.setValue(data["content"]);
            update();
        },
        error: function(xhr, status, error) {
            console.error(xhr); // TODO: error handling!
        }
    });
}

export function jump(lineNo : number) {
    editor.scrollTo(null, editor.charCoords({line: lineNo, ch: 0}, "local").top); 
}

export function insertCode(text : string) {
    var doc = editor.getDoc();
    var cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
}

export function undo() {
    editor.undo();
}

export function redo() {
    editor.redo();
}

export function save() {
    alert("unimplemented");
}

export function update() {
    let compiler = new compile.Compiler();
    compilerOutput = compiler.compile(editor.getValue());
    document.getElementById("rendered-content").innerHTML = compilerOutput.html;

    compilerOutput.refresh();
    
    // refresh SELL-quizzes -> TODO: move code to quiz.ts
    sellquiz.reset();
    sellquiz.setLanguage(lang.language);
    //sellquiz.setServicePath(TODO);
    const n = compilerOutput.sellQuizzes.length;
    for(let i=0; i<n; i++) {
        let domElement = document.getElementById("sellquiz-" + i);
        let qIdx = sellquiz.createQuestion(compilerOutput.sellQuizzes[i].src);
        sellquiz.setQuestionHtmlElement(qIdx, domElement);
        if(qIdx < 0) {
            let err = sellquiz.getErrorLog().replaceAll("\n","<br/>");
            let html = '<div class="card border-dark"><div class="card-body">';
            html += '<p class="text-danger"><b>' + err + '</b></p>';
            html += '</div></div>';
            domElement.innerHTML = html;
        } else {
            let quizHtml = sellquiz.getQuestionHighLevelHTML(qIdx);
            domElement.innerHTML = quizHtml;
            sellquiz.refreshQuestion(qIdx);
        }
    }

    /*setTimeout(function(){ 
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "rendered-content"]);
    }, 5000);*/
    
}

export function eval_prog(idx : number) {
    if(compilerOutput == null)
        return;
    compilerOutput.programmingQuizzes[idx].evaluate();
}

export function eval_stack(idx : number) {
    if(compilerOutput == null)
        return;
    compilerOutput.stackQuizzes[idx].evaluate();
}

export function export_stack(idx : number) {
    if(compilerOutput == null)
        return;
    compilerOutput.stackQuizzes[idx].exportMoodleXML();
}

export function toggle(buttonName : string) {
    let element = document.getElementById(buttonName);
    toggle_states[buttonName] = !toggle_states[buttonName];
    if(toggle_states[buttonName])
        element.className = "btn btn-dark mx-0 btn-sm";
    else
        element.className = "btn btn-outline-dark mx-0 btn-sm";
}
