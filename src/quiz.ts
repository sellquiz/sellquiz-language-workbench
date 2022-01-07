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

import * as slw from './index';
import * as lang from './lang';
import * as QuizMXML from './quiz-mxml';

const MAXIMA_PROLOG =
      "display2d:false;\n"
    + "stardisp:true;\n"
    + "e:%e;\n"
    + "i:%i;\n";

export class SellQuiz {
    id = 0;
    src = "";
}

class StackQuizInput {
    ident = "";
    // TODO: kind of evaluation (e.g. algebraic, numeric, ...)
}

export class StackQuiz {

    id = 0;
    title = "";
    code = "";
    text = "";
    solutionText = "";
    error = "";
    solution : {[name:string]:string} = {};
    inputs : Array<StackQuizInput> = [];
    tagList : Array<string> = [];

    compileCode(code : string) : string {
        let output = MAXIMA_PROLOG;
        // fix code.
        // TODO: fix STACK random functions!!
        const lines = code.split("\n");
        for(let i=0; i<lines.length; i++) {
            if(lines[i].startsWith(" ") || lines[i].startsWith("\t"))
                continue;
            let line = lines[i].trim();
            if(line.length == 0)
                continue;
            if(line.endsWith(";") == false)
                line += ";";
            output += line + "\n";
        }
        return output;
    }

    evaluate() {
        for(let i=0; i<this.inputs.length; i++) {
            const input = this.inputs[i];
            const studentAnswer = (<HTMLInputElement>document.getElementById(
                "stackquiz-" + this.id + "-input-" + input.ident)).value;
            const feedbackElement = document.getElementById(
                "stackquiz-" + this.id + "-feedback-" + input.ident);
            // TODO: evaluation depends on whether we compare terms or floats or ...

            // call maxima
            const service_url = "services/maxima.php";
            const this_ = this;
            let code = MAXIMA_PROLOG;

            // TODO: THE FOLLOWING DOES NOT WORK IN GENERAL, SINCE "e" may occour in variables, functions etc!!!!!
            const studentAnswer_maxima = studentAnswer.replace(/e/, "%e");

            code += "float(ev((" + studentAnswer_maxima + ")" + " - (" + this.solution[input.ident] + ")));";
            axios.post(service_url, new URLSearchParams({
                input: code
            }))
            .then(function(response) {
                /* ===== EXAMPLE for response.data =====
                (%i1) batch("../cache/4493607800000261864/maxima-input.txt")
                read and interpret /Users/andi/git/github/sellquiz-language-workbench/cache/4493607800000261864/maxima-input.txt
                (%i2) display2d:false
                (%o2) false
                (%i3) ev(1-688)
                (%o3) -687
                (%o4) "/Users/andi/git/github/sellquiz-language-workbench/cache/4493607800000261864/maxima-input.txt"
                */
                //alert(response.data)
                let solution = 0.0;
                const syntaxError = response.data.includes('Syntax error')
                    || response.data.includes('incorrect syntax');
                //alert(response.data)
                if(syntaxError) {
                    //alert("syntax error!")
                    feedbackElement.innerHTML = lang.red_text("syntax_error"); // TODO: get error details!
                }
                else {
                    //alert(response.data)
                    const lines = response.data.split("\n");
                    for(const line of lines) {
                        if(line.startsWith("(%o6)")) {
                            solution = parseFloat(line.substring(6));
                        }
                    }
                    if(Math.abs(solution) < 1e-5) { // TODO: precision
                    //if(Math.abs(parseFloat(this_.solution[input.ident+"_float"]) - parseFloat(studentAnswer)) < 1e-5) { // TODO: precision
                        feedbackElement.innerHTML = lang.checkmark;
                    } else {
                        feedbackElement.innerHTML = lang.crossmark;
                    }
                }
            })
            .catch(function(error) {
                console.error(error); // TODO: error handling!
            });
        }
    }

    importMaximaResults(res : string) : boolean {
        /* ===== EXAMPLE =====
        (%i1) batch("../cache/589874539628642604/maxima-input.txt")
        read and interpret /Users/andi/git/github/sellquiz-language-workbench/cache/589874539628642604/maxima-input.txt
        (%i2) display2d:false
        (%o2) false
        (%i3) A:2+random(30)
        (%o3) 4
        (%i4) B:2+random(30)
        (%o4) 14
        (%i5) ls1:integrate(x^5+sqrt(x),x,0,A)
        (%o5) 688
        (%i6) ls2:integrate(e^x+B*sin(x),x,3,5)
        (%o6) -((14*cos(5)-14*cos(3))*log(e)-e^5+e^3)/log(e)
        (%i7) values
        (%o7) [A,B,ls1,ls2]
        (%i8) ev(values)
        (%o8) [4,14,688,-((14*cos(5)-14*cos(3))*log(e)-e^5+e^3)/log(e)]
        (%i9) float(ev(values))
        (%o9) [4.0,14.0,688.0,-(1.0*(17.83116554889141*log(e)-1.0*e^5+e^3))/log(e)]
        (%o10) "/Users/andi/git/github/sellquiz-language-workbench/cache/589874539628642604/maxima-input.txt"
        */
        const lines = res.split("\n");
        let state = "";
        let values = "";
        let evalValues = "";
        let evalValuesFloat = "";
        for(let i=0; i<lines.length; i++) {
            const line = lines[i].trim();
            if(line.endsWith(") values")) {
                state = "v";
            } else if(line.endsWith(") ev(values)")) {
                state = "ev";
            } else if(line.endsWith(") float(ev(values))")) {
                state = "ev_float";
            } else if(state == "v") {
                //console.log(line);
                values = line;
                state = "";
            } else if(state == "ev") {
                //console.log(line);
                evalValues = line;
                state = "";
            } else if(state == "ev_float") {
                //console.log(line);
                evalValuesFloat = line;
                state = "";
            }
        }
        // parse values
        let start = 0;
        for(let i=0; i<values.length; i++) {
            if(values[i] == ")") {
                start = i + 3;
                break;
            }
        }
        const valuesArr = values.substring(start, values.length-1).trim().split(",");
        //console.log(valuesArr);
        // parse evaluation result: TODO: this may not work for matrices, sets, text, ...
        start = 0;
        for(let i=0; i<evalValues.length; i++) {
            if(evalValues[i] == ")") {
                start = i + 3;
                break;
            }
        }
        const evalValuesArr
            = evalValues.substring(start, evalValues.length-1).trim().split(",");
        //console.log(evalValuesArr);
        // parse float values
        start = 0;
        for(let i=0; i<evalValuesFloat.length; i++) {
            if(evalValuesFloat[i] == ")") {
                start = i + 3;
                break;
            }
        }
        const evalValuesArrFloat
            = evalValuesFloat.substring(start, evalValuesFloat.length-1).trim().split(",");
        //console.log(evalValuesArrFloat);
        // TODO: assert equal length of values and evalValues!
        for(let i=0; i<valuesArr.length; i++) {
            this.solution[valuesArr[i]] = evalValuesArr[i];
            this.solution[valuesArr[i]+"_float"] = evalValuesArrFloat[i];
        }
        //console.log(_this.solution);
        return true;
    }

    refresh() {
        if(this.error.length > 0)
            return;
        // call maxima
        const service_url = "services/maxima.php";
        const this_ = this;
        //alert(this.code)
        axios.post(service_url, new URLSearchParams({
            input: this.code
        }))
        .then(function(response) {
            this_.importMaximaResults(response.data);
            this_.updateHTML();
        })
        .catch(function(error) {
            console.error(error); // TODO: error handling!
        });
    }

    replaceIdentifier(ident : string, hashtag : boolean) : string {
        let output = "";
        if(["e", "i"].includes(ident)==false && ident in this.solution) {
            if(hashtag) {
                // input field
                const inputWidth = 8; // TODO
                const input = new StackQuizInput();
                input.ident = ident;
                this.inputs.push(input);
                const inputField = '` <input type="text" value="" id="stackquiz-' + this.id + '-input-' + ident + '" size="' + inputWidth + '" placeholder=""> ';
                output += inputField;
                const feedback = ' <span id="stackquiz-' + this.id + '-feedback-' + ident + '"></span>` ';
                output += feedback;
            } else
                output += this.solution[ident];
        }
        else
            output += ident;
        return output;
    }

    replaceVariablesAndInputFields(input : string) : string {
        // this function replaces all identifieres that are knonwn variables.
        // If an identifier is preceded by '#', then an input field is generated.
        let output = "";
        let state = "";
        let ident = "";
        let hashtag = false;
        const n = input.length;
        for(let i=0; i<n; i++) {
            const ch = input[i];
            if(ch == '`') {
                state = state=='$' ? '' : '$';
                if(ident.length > 0) {
                    output += this.replaceIdentifier(ident, hashtag);
                    ident = "";
                }
                output += ch;
            } else if(state == '$') {
                if( (ch>='A'&&ch<='Z') || (ch>='a'&&ch<='z') /*|| (ch=='_')*/ ) {
                    ident += ch;
                } else if(ident.length > 0 && (ch>='0'&&ch<='9')) {
                    ident += ch;
                } else {
                    if(ident.length > 0) {
                        output += this.replaceIdentifier(ident, hashtag);
                        ident = "";
                    }
                    if(ch == '#')
                        hashtag = true;
                    else {
                        hashtag = false;
                        output += ch;
                    }
                }
            } else {
                output += ch;
            }
        }
        //console.log("#####" + output)
        return output;
    }

    updateHTML() {
        let html = "";
        if(this.error.length > 0) {
            html += "<div class=\"card border-dark\">";
            html += "<div class=\"card-body\">\n";
            html += "<span class=\"h2 py-1 my-1\">"
                + '<i class="fas fa-question-circle"></i> '
                + "Stack-Quiz: ERROR" + "</span><br/>\n";
            html += "<p class=\"text-danger\">" + this.error + "</p>";
            html += "</div>\n"; // end of card body
            html += "</div>\n"; // end of card
        } else {
            // get variables
            let var_text = "";
            for(const sol in this.solution) {
                if(["e", "i"].includes(sol))
                    continue;
                if(sol.endsWith("_float"))
                    continue;
                if(var_text.length > 0)
                    var_text += ", ";
                var_text += sol + "=" + this.solution[sol]
                    + " (" + this.solution[sol+"_float"] + ")";
            }
            // create HTML
            html += "<div class=\"card border-dark\">";
            html += "<div class=\"card-body\">\n";
            // title
            html += "<span class=\"h2 py-1 my-1\">"
                + '<i class="fas fa-question-circle"></i> '
                + this.title + "</span><br/>\n";
            // text (with replaced variables)
            html += this.replaceVariablesAndInputFields(this.text);
            // TODO: must trigger tooltip-update!
            html += '<button type="button" class="btn btn-primary" onclick="slw.eval_stack(\'' + this.id + '\');">'
                + lang.text("evaluate") + '</button>' + ' ';

            if(slw.toggle_states["preview-show-export"]) {
                html += '<button type="button" class="btn btn-outline-primary" ';
                html += 'data-bs-toggle="tooltip" data-bs-placement="bottom" ';
                html += 'title="export to Moodle-XML" ';
                html += 'onclick="slw.export_stack(' + this.id + ')">';
                html += '<i class="fas fa-file-export"></i></button>' + ' ';
            }

            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="general_feedback"></span><br/>';

            html += "</div>\n"; // end of card body

            if(slw.toggle_states["preview-show-variables"]) {
                html += "<div class=\"card-footer text-muted\">";
                html += "<b>" + lang.text("variables") + ":</b>"; // TODO: language
                html += "<p class=\"font-monospace\">" + var_text + "</p>";
                html += "</div>\n"; // end of card footer
            }

            if(slw.toggle_states["preview-show-solutions"]) {
                html += "<div class=\"card-footer text-muted\">";
                html += "<b>" + lang.text("solution") + ":</b> ";
                html += this.replaceVariablesAndInputFields(this.solutionText);
                html += "</div>\n"; // end of card footer
            }

            html += "</div>\n"; // end of card
        }
        document.getElementById("stackquiz-" + this.id).innerHTML = html;

        eval("typeset();");
    }

    exportMoodleXML() {
        let mxml = QuizMXML.moodle_XML_stack_template;

        mxml = mxml.replace(/@TITLE@/g, this.title);
        // TODO: must replace random functions!!
        mxml = mxml.replace(/@VARIABLES@/g, this.code);
        mxml = mxml.replace(/@TEXT_CORRECT@/g,
            lang.text("moodle_correct"));
        mxml = mxml.replace(/@TEXT_PARTIALLY_CORRECT@/g,
            lang.text("moodle_partially_correct"));
        mxml = mxml.replace(/@TEXT_NOT_CORRECT@/g,
            lang.text("moodle_not_correct"));
        mxml = mxml.replace(/@TAGS@/g, ""); // TODO (must refer to example file!!)

        // TODO: inputs, prts

        alert(mxml);
    }

}
