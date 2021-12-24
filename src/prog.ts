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

import axios from 'axios';
import 'codemirror/addon/selection/active-line';
import * as codemirror from 'codemirror';

import * as slw from './index';
import * as lang from './lang';

export enum ProgrammingQuizType {
    JavaBlock = "JavaBlock",
    Python = "Python"
}

export class ProgrammingQuiz {

    id = 0;

    type = ProgrammingQuizType.JavaBlock;
    title = "";
    text = "";
    given = "";
    asserts : Array<string> = [];
    forbiddenKeywords : Array<string> = [];
    requiredKeywords : Array<string> = [];
    solution = "";

    editor : any = null;

    refresh() {
        // TODO
    }

    evaluate() {
        const src = this.editor.getValue().split("\n");
        // restore given source code:
        const givenSrc = this.given.split("\n");
        let restored_src = '';
        for(let i=0; i<src.length; i++) {
            if(i < givenSrc.length)
                restored_src += givenSrc[i] + "\n";
            else
                restored_src += src[i] + "\n";
        }
        restored_src = restored_src.replace(/§/g, "");
        //
        const task = {
            "type": this.type,
            "source": restored_src,
            "asserts": this.asserts,
            "language": lang.language
        };
        const service_url = "services/prog.php";
        // TODO: should forbid running twice at the same time!!!!!
        const feedback_htmlElement = document.getElementById("programming-feedback-" + this.id);
        const wait_text = lang.text("please_wait");
        feedback_htmlElement.innerHTML = "<span class=\"text-danger\">" + wait_text + "</span>";
        axios.post(service_url, new URLSearchParams({
            input: JSON.stringify(task)
        }))
        .then(function(response) {
            const data = response.data;
            const status = data["status"];
            const message = data["msg"];
            feedback_htmlElement.innerHTML = ((status==="ok") ? lang.checkmark : lang.crossmark)
                + " ";
            feedback_htmlElement.innerHTML += ' &nbsp; <code>' + message.replaceAll("\n", "<br/>").replaceAll(" ","&nbsp;") + '</code>';
        })
        .catch(function(error) {
            console.error(error); // TODO: error handling!
        });
    }

    updateHTML() {
        let html = "";
        html += "<div class=\"card border-dark\">";
        html += "<div class=\"card-body\">\n";

        html += "<span class=\"h2 py-1 my-1\">"
            + '<i class="fas fa-keyboard"></i> '
            + this.title + "</span><br/>\n";
        html += this.text;
        html += '<div class="border p-0 m-0"><textarea class="form-control p-0" style="min-width: 100%;" id="programming-editor-' + this.id + '" + rows="5"></textarea></div>';
        html += '<p id="programming-feedback-' + this.id + '"></p>';
        const evalStr = lang.text("evaluate");
        html += '<button type="button" class="btn btn-primary" onclick="slw.eval_prog(\''
            + this.id + '\')">' + evalStr + '</button>' + ' ';
        html += "</div>\n"; // end of card body

        if(slw.toggle_states["preview-show-solutions"]) {
            html += "<div class=\"card-footer text-muted\">";
            html += "<b>" + lang.text("solution") + ":</b><br/>";
            html += "<code class=\"text-secondary\"><pre>";
            html += this.solution;
            html += "</pre></code>";
            html += "</div>\n"; // end of card footer
        }

        html += "</div>\n"; // end of card

        document.getElementById("programming-" + this.id).innerHTML = html;

        let codeMirrorMode = "";
        switch(this.type) {
            case ProgrammingQuizType.JavaBlock:
                codeMirrorMode = "text/x-java";
                break;
            case ProgrammingQuizType.Python:
                codeMirrorMode = "python";
                break;
        }

        this.editor = codemirror.fromTextArea(
            document.getElementById("programming-editor-" + this.id) as HTMLTextAreaElement, {
                mode: codeMirrorMode,   // TODO!!!!!!
                lineNumbers: true,
                lineWrapping: true/*
                styleActiveLine: {
                    nonEmpty: true
                },*/
            }
        );

        // hide everything between a pair of '§'
        const givenSrc = this.given.replace(/§\d*§/g, "?") + "\n";
        this.editor.setValue(givenSrc);

        // forbid changing given code
        const this_ = this;
        this.editor.on('beforeChange',function(cm : any, change : any) {
            if(change.from.line < this_.given.split("\n").length-1) {
                change.cancel();
            }
        });
        // TODO: background color for static lines
        // this.editor.addLineClass(0, "background", "highlighted-line");
    }

}
