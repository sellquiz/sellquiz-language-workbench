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
//import "mathjax";
import * as sellquiz from 'sellquiz';

import * as lang from './lang.js';
import * as compile from './compile.js';

export var editor : codemirror.EditorFromTextArea = null;

export function init() {
    
    // init code editor

    /*CodeMirrorSpellChecker({ // TODO: activate / deactivate option
        codeMirrorInstance: CodeMirror,
    });*/

    editor = codemirror.fromTextArea(document.getElementById("editor") as HTMLTextAreaElement, {
        //mode: "spell-checker",  // TODO: activate / deactivate option
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
                    onclick="insertCode('` + code + `');"
                    style="cursor:pointer;"
                    >` + id + `</a>`;   
    }
    document.getElementById("insertCodeList").innerHTML = html;
    
    // read demo file    
    $.ajax({
        type: "POST",
        url: "services/read.php",
        data: {
            path: "data/files/hello.txt"  // TODO
        },
        success: function(data) {
            editor.setValue(data);
            update();
        },
        error: function(xhr, status, error) {
            console.error(xhr); // TODO: error handling!
        }
    });
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
    let co = compiler.compile(editor.getValue());
    document.getElementById("rendered-content").innerHTML = co.html;

    co.refreshQuizzes();
    
    // refresh SELL-quizzes -> TODO: move code
    sellquiz.reset();
    sellquiz.setLanguage(lang.language);
    //sellquiz.setServicePath(TODO);
    const n = co.sellQuizzes.length;
    for(let i=0; i<n; i++) {
        let domElement = document.getElementById("sellquiz-" + i);
        let qIdx = sellquiz.createQuestion(co.sellQuizzes[i].src);
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
