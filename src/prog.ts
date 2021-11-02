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
import * as lang from './lang';
 
export enum ProgrammingQuizType {
    JavaBlock 
};

export class PorgrammingQuiz {

    id = 0;

    type = ProgrammingQuizType.JavaBlock;
    title = "";
    text = "";
    given = "";
    asserts : Array<string> = [];
    forbiddenKeywords : Array<string> = [];
    requiredKeywords : Array<string> = [];
    solution = "";

    editor = null;

    constructor() {
    }

    refresh() {
        // TODO
    }

    evaluate() {
        let src = this.editor.getValue().split("\n");
        // restore given source code:
        let givenSrc = this.given.split("\n");
        let restored_src = '';
        for(let i=0; i<src.length; i++) {
            if(i < givenSrc.length)
                restored_src += givenSrc[i] + "\n";
            else
                restored_src += src[i] + "\n";
        }
        restored_src = restored_src.replaceAll("§","");
        // 
        let task = {
            "type": "JavaBlock", // TODO!!!!!
            "source": restored_src,
            "asserts": this.asserts,
            "language": lang.language
        };
        let service_url = "../services/prog.php";
        // TODO: should forbid running twice at the same time!!!!!
        let feedback_htmlElement = document.getElementById("programming-feedback-" + this.id);
        let wait_text = lang.text("please_wait");
        feedback_htmlElement.innerHTML = "<span class=\"text-danger\">" + wait_text + "</span>";
        $.ajax({
            type: "POST",
            url: service_url,
            data: {
                input: JSON.stringify(task)
            },
            success: function(data) {
                data = JSON.parse(data);
                let status = data["status"];
                let message = data["msg"];
                feedback_htmlElement.innerHTML = ((status==="ok") ? lang.checkmark : lang.crossmark) 
                    + " "; 
                feedback_htmlElement.innerHTML += ' &nbsp; <code>' + message.replaceAll("\n", "<br/>").replaceAll(" ","&nbsp;") + '</code>';
            },
            error: function(xhr, status, error) {
                console.error(xhr); // TODO: error handling!
            }
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

        let evalStr = "Auswerten"; // TODO: language!
        html += '<button type="button" class="btn btn-primary" onclick="slw.eval_prog(\'' 
            + this.id + '\')">' + evalStr + '</button>' + ' ';

        html += "</div>\n"; // end of card body
        html += "</div>\n"; // end of card

        document.getElementById("programming-" + this.id).innerHTML = html;

        this.editor = codemirror.fromTextArea(
            document.getElementById("programming-editor-" + this.id) as HTMLTextAreaElement, {
                mode: "text/x-java",
                lineNumbers: true,
                lineWrapping: true/*
                styleActiveLine: {
                    nonEmpty: true
                },*/
            }
        );

        // hide everything between a pair of '§'
        let givenSrc = this.given.replace(/§\d*§/g, "?") + "\n";
        this.editor.setValue(givenSrc);

        // forbid changing given code
        let this_ = this;
        this.editor.on('beforeChange',function(cm, change) {
            if(change.from.line < this_.given.split("\n").length-1) {
                change.cancel();
            }
        });
        // TODO: background color for static lines
        // this.editor.addLineClass(0, "background", "highlighted-line");
    }

}
