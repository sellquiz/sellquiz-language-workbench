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

import 'codemirror/mode/clike/clike';
import 'codemirror/addon/mode/simple';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/mode/overlay';
// esbuild requires 'codemirror' import AFTER modes and addons
import * as CodeMirror from 'codemirror';

//import * as sellquiz from 'sellquiz';

import * as lang from './lang';
import * as spell from './spell';
import * as compile from './compile';

export let spellInst : any = null; // load on demand to reduce traffic to load dictionary

export let editor : CodeMirror.EditorFromTextArea = null;
export let compilerOutput : compile.CompilerOutput = null;

export let current_course = '';
export let current_file = '';

export const toggle_states : {[key:string]:boolean} = {
    "preview-spell-check": false,
    "preview-show-source-links": true,
    "preview-show-solutions": true,
    "preview-show-variables": true,
    "preview-show-export": true
}

export function refresh_filelist() {
    const filelist_button = document.getElementById("filelist_button");
    const filelist_dropdown_items = document.getElementById("filelist_dropdown_items");
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
            for(const file of data["file_list"]) {
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
    const courselist_button = document.getElementById("courselist_button");
    const courselist_dropdown_items = document.getElementById("courselist_dropdown_items");
    $.ajax({
        type: "POST",
        url: "services/courselist.php",
        data: { },
        success: function(data) {
            data = JSON.parse(data);
            if(data["status"] === "error")
                alert(data["error_message"]); // TODO
            let html = '', i = 0;
            for(const course of data["course_list"]) {
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
    CodeMirror.defineSimpleMode("sellquiz-edit", {
        start: [
            {regex: /\$(?:[^\\]|\\.)*?(?:\$|$)/, token: "string"},
            {regex: /`(?:[^\\]|\\.)*?(?:`)/, token: "string"},
            {regex: /%.*/, token: "comment"},
            {regex: /#.*/, token: "keyword", sol: true},
            {regex: /---|Definition\.|Theorem\.|Question\.|Remark\.|JavaBlock\.|Python\.|Tikz\.|Plot2d\.|@tags|@code|@text|@solution|@given|@asserts|@forbidden-keywords|@required-keywords/, token: "keyword"},
        ],
        comment: [

        ],
        meta: {
            dontIndentStates: ["comment"],
            lineComment: "%"
        }
    });

    editor = CodeMirror.fromTextArea(
            document.getElementById("editor") as HTMLTextAreaElement, {
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
    editor.setSize(null, "100%");

    // populate math symbols
    let html = "<table class=\"p-1\">";
    const symbols = ['sum','prod','xx','@','o+','ox','o.','^^','^^^','vv','vvv','nn','nnn','uu','uuu','a/b','a^b','sqrt(x)','root(x)(y)','int','oint','del','grad','+-','O/','oo','aleph','abs(x)','floor(x)','ceil(x)','norm(vecx)','/_','/_\\','diamond','square','CC','NN','QQ','RR','ZZ','"text"','!=','<','>','<=','>=','-<','-<=','>-','>-=','in','notin','sub','sup','sube','supe','-=','~=','~~','prop','neg','=>','<=>','AA','EE','_|_','TT','|--','|==','{','}','(:',':)','<<','>>','uarr','darr','->','>->','->>','>->>','|->','larr','harr','rArr','lArr','hArr','hat x','bar x','ul x','vec x','tilde x','dot x','ddot x','overset(x)(=)','underset(x)(=)','ubrace(x)','obrace(x)','color(red)(x)','cancel(x)',
    'alpha','beta','gamma','delta','epsilon','varepsilon','zeta','eta','theta','vartheta','iota','kappa','lambda','mu','nu','xi','pi','rho','sigma','tau','upsilon','phi','varphi','chi','psi','omega',
    'bb "Aa"', 'bbb "Aa"', 'cc "Aa"', 'tt "Aa"', 'fr "Aa"', 'sf "Aa"',
    '[[a,b],[c,d]]','((a),(b))','[[a,b,|,c],[d,e,|,f]]',
    'lim_(n->oo) sum_(i=0)^n', 'int_0^1 f(x) \\ dx', 'f\'(x)=dy/dx'];
    const cols = 16;
    const rows = Math.ceil(symbols.length/cols);
    for(let i=0; i<rows; i++) {
        html += "<tr>";
        for(let j=0; j<cols; j++) {
            const idx = i*cols+j;
            if(idx < symbols.length) {
                const onclick = "slw.insertCode(' " + symbols[idx] + " ');slw.editor.focus();";
                html += "<td class=\"border border-dark p-1 text-center\" style=\"cursor:pointer;\"><a onclick=\"" + onclick + "\"> ` "
                    + symbols[idx] + " ` </a></td>";
            }
            else
                html += "<td></td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("math-symbols").innerHTML = html;

    // populate code templates
    const code_templates = [
        "Document Title", "\n##### My Title\n",
        "Section", "\n# My Section\n",
        "Subsection", "\n## My Subsection\n",
        "Subsubsection", "\n### My Subsubsection\n",
        "Definition", "\n---\nDefinition.\n---\n\n",
        "Theorem", "\n---\nTheorem.\n---\n\n",
        "SELL-Quiz", "\n---\nSell. My Quiz\n\tx, y in {1,2,3}\n\\tz := x + y\n$ x + y = #z $\n---\n\n",
        "STACK-Quiz", "\n---\nStack. My Quiz\n\n@code\nx:random(10)\ny:random(10)\nz:x+y;\n\n@text\n$x+y=#z$\n\n@solution\nJust add both numbers!\n---\n\n",
    ];
    html = '';
    for(let i=0; i<code_templates.length/2; i++) {
        const id = code_templates[i*2+0];
        const code = code_templates[i*2+1].replace(/\n/g,"\\n").replace(/\t/g,"\\t");
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
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
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
    const compiler = new compile.Compiler();
    compiler.spellCheck = toggle_states["preview-spell-check"];
    compilerOutput = compiler.compile(editor.getValue());
    document.getElementById("rendered-content").innerHTML = compilerOutput.html;

    compilerOutput.refresh();

    /*// refresh SELL-quizzes -> TODO: move code to quiz.ts
    sellquiz.reset();
    sellquiz.setLanguage(lang.language);
    //sellquiz.setServicePath(TODO);
    const n = compilerOutput.sellQuizzes.length;
    for(let i=0; i<n; i++) {
        const domElement = document.getElementById("sellquiz-" + i);
        const qIdx = sellquiz.createQuestion(compilerOutput.sellQuizzes[i].src);
        sellquiz.setQuestionHtmlElement(qIdx, domElement);
        if(qIdx < 0) {
            const err = sellquiz.getErrorLog().replace(/\n/g,"<br/>");
            let html = '<div class="card border-dark"><div class="card-body">';
            html += '<p class="text-danger"><b>' + err + '</b></p>';
            html += '</div></div>';
            domElement.innerHTML = html;
        } else {
            const quizHtml = sellquiz.getQuestionHighLevelHTML(qIdx);
            domElement.innerHTML = quizHtml;
            sellquiz.refreshQuestion(qIdx);
        }
    }*/

    eval("typeset()");
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
    const element = document.getElementById(buttonName);
    toggle_states[buttonName] = !toggle_states[buttonName];
    if(toggle_states[buttonName])
        element.className = "btn btn-dark mx-0 btn-sm";
    else
        element.className = "btn btn-outline-dark mx-0 btn-sm";

    if(buttonName=="preview-spell-check") {
        if(spellInst == null) {
            spellInst = new spell.Spell();
        } else
            update();
    }

}
