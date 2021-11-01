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

//import "mathjax";

export class SellQuiz {
    id = 0;
    src = "";
    constructor() {
    }
}

export class StackQuiz {
    id = 0;
    title = "";
    code = "";
    text = "";
    solutiontext = "";
    error = "";
    solution : {[name:string]:string} = {};
    
    constructor() {
    }

    refresh() {
        // call maxima
        let service_url = "../services/maxima.php";
        let _this = this;
        $.ajax({
            type: "POST",
            url: service_url,
            data: {
                input: this.code
            },
            success: function(data) {
                //console.log(data);
                let lines = data.split("\n");
                let state = "";
                let values = "";
                let evalValues = "";
                for(let i=0; i<lines.length; i++) {
                    let line = lines[i].trim();
                    if(line.endsWith(") values")) {
                        state = "v";
                    } else if(line.endsWith(") ev(values)")) {
                        state = "ev";
                    } else if(state == "v") {
                        //console.log(line);
                        values = line;
                        state = "";
                    } else if(state == "ev") {
                        //console.log(line);
                        evalValues = line;
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
                let valuesArr = values.substring(start, values.length-1).trim().split(",");
                //console.log(valuesArr);
                // parse evaluation result: TODO: this does not work for matrices, sets, text, ...
                start = 0;
                for(let i=0; i<evalValues.length; i++) {
                    if(evalValues[i] == ")") {
                        start = i + 3;
                        break;
                    }
                }
                let evalValuesArr 
                    = evalValues.substring(start, evalValues.length-1).trim().split(",");
                //console.log(evalValuesArr);

                //alert(_this.solution)

                // TODO: assert equal length of values and evalValues!
                for(let i=0; i<valuesArr.length; i++) {
                    _this.solution[valuesArr[i]] = evalValuesArr[i];
                }
                //console.log(_this.solution);

                _this.updateHTML();
                //setTimeout(function(){ mathjax.typeset(); }, 250); // TODO: do not call this for EVERY quiz separately, but only when LAST quiz is ready
            },
            error: function(xhr, status, error) {
                console.error(xhr); // TODO: error handling!
            }
        });
    }

    placeVariables(input : string) : string { // TODO: rename: also placing input fields here!!
        let output = "";
        let state = "";
        let ident = "";
        let hashtag = false;
        const n = input.length;
        for(let i=0; i<n; i++) {
            let ch = input[i];
            if(ch == '`') {
                state = state=='$' ? '' : '$';
                if(ident.length > 0) {
                    if(ident in this.solution)
                        output += this.solution[ident];
                    else
                        output += ident;
                }
                output += ch;
            } else if(state == '$') {
                if( (ch>='A'&&ch<='Z') || (ch>='a'&&ch<='z') /*|| (ch=='_')*/ ) {
                    ident += ch;
                } else if(ident.length > 0 && (ch>='0'&&ch<='9')) {
                    ident += ch;
                } else {
                    if(ident.length > 0) {
                        //console.log("ident=" + ident)
                        if(ident in this.solution) {
                            if(hashtag) {
                                // input field
                                let inputwidth = 5; // TODO
                                let inputfield = '` <input type="text" value="" id="" size="' + inputwidth + '" placeholder="">` ';
                                output += inputfield;
                            } else
                                output += this.solution[ident];
                        }
                        else
                            output += ident;
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
        let var_text = "";
        for(let sol in this.solution) {
            if(var_text.length > 0)
                var_text += ", ";
            var_text += sol + "=" + this.solution[sol];
        }
        
        let html = "";
        html += "<div class=\"card border-dark\">";
        html += "<div class=\"card-body\">\n";
        html += "<span class=\"h2 py-1 my-1\">" 
            + '<i class="fas fa-question-circle"></i> '
            + this.title + "</span><br/>\n";
        
        /*html += "<p class=\"my-1 p-1 small font-monospace text-light bg-dark\">" 
            + var_text + "</span>";
        html += '</p>';*/
            
        html += this.placeVariables(this.text.replaceAll("$","`"));

        html += '<span>';
        let evalStr = "Auswerten"; // TODO: language!
        //let showSolStr = "Lösung anzeigen"; // TODO: language!
        html += '<button type="button" class="btn btn-primary" onclick="">' + evalStr + '</button>' + ' ';
        //html += '<button type="button" class="btn btn-primary" onclick="">' + showSolStr + '</button>';
        html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="general_feedback"><br/>';

        html += "</div>\n"; // end of card body

        html += "<div class=\"card-footer text-muted\">";
        html += "<b>Variablen:</b>";
        html += "<p class=\"font-monospace\">" + var_text + "</p>";
        html += "</div>\n"; // end of card footer

        html += "<div class=\"card-footer text-muted\">";
        html += "<b>Lösung:</b> ";
        html += this.placeVariables(this.solutiontext.replaceAll("$","`"));
        html += "</div>\n"; // end of card footer

        html += "</div>\n"; // end of card

        document.getElementById("stackquiz-" + this.id).innerHTML = html;
    }

}
