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

import * as lang from './lang.js';
import * as quiz from './quiz.js';

class CompilerOutput {

    title = "";
    html = "";
    sellQuizzes = [];
    stackQuizzes = [];

    constructor() {
    }

    refreshQuizzes() {
        for(let q of this.stackQuizzes) {
            q.updateHTML();
            q.refresh();
        }
    }

}

const template = `
<div id="container" class="container">
    <br/>
    <p class="text-center">
        <span class="display-1">$TITLE$</span>
    </p>
    <p class="text-center lead">
        $LEADTEXT$
    </p>
</div>
<div id="container" class="container">
    <div class="row">
        <div class="col-sm">
            $CONTENT$
        </div>
    </div>
</div>
`;

export class Compiler {

    compile(input_str : string, rootCall=true) : CompilerOutput {
        let co = new CompilerOutput();
    
        let input = input_str.split("\n");
        let leadtext = "";
        let content = "";
    
        // numbering
        let sec = 1;
        let subsec = 1;
        let subsubsec = 1;
        let definition = 1;
        let eqn = 1;
    
        let block_types = ["def", "theorem", "remark", "sell", "stack"];
    
        let unordereditems = [];
        let ordereditems = [];
        let box = "";
        let boxtype = "";
        let parsing_box = false;
        
        for(let i=0; i<input.length; i++) {
            let x = input[i];
            if(x.startsWith("%")) {
                // comment
            }
            else if(parsing_box && !x.startsWith("---")) {
                let known_type = false;
                if(box.length == 0) {
                    for(let type of block_types) {
                        if(x.toLowerCase().startsWith(type + ".")) {
                            boxtype = type;
                            box += x.substring((type+".").length).trim() + "\n";
                            known_type = true;
                            break;
                        }
                    }
                    if(!known_type)
                        box += x + "\n";
                }
                else {
                    box += x + "\n";
                }
            }
            else if(unordereditems.length > 0 && (x.startsWith(" ") || x.startsWith("\t"))) {
                unordereditems[unordereditems.length-1] += '<br/>' + x;
            }
            else if(unordereditems.length > 0 && !x.startsWith("* ")) {
                content += "<ul>";
                for(let item of unordereditems)
                    content += "<li>" + item + "</li>";
                content += "</ul>";
                unordereditems = [];
            }
            else if(ordereditems.length > 0 && (x.startsWith(" ") || x.startsWith("\t"))) {
                ordereditems[ordereditems.length-1] += '<br/>' + x;
            }
            else if(ordereditems.length > 0 && !x.startsWith("- ")) {
                content += "<ol>";
                for(let item of ordereditems)
                    content += "<li>" + item + "</li>";
                content += "</ol>";
                ordereditems = [];
            }
            else if(x.startsWith("* ")) {
                unordereditems.push(x.substring(2));
            }
            else if(x.startsWith("- ")) {
                ordereditems.push(x.substring(2));
            }
            // centered equation
            else if(x.trim().startsWith("$") && x.length>1 && (x[0]==" "||x[0]=="\t")) {
                content += `
                <div class="" style="position:relative">
                    <p class="text-center" style="position:absolute;width:100%;">
                        ` + x.trim().replaceAll("$","`") + `
                    </p>
                    <p class="text-end" style="position:absolute;width:100%;">
                        (\`` + eqn + `\`)
                    </p>
                </div>`;
                content += "<br/>";
                eqn ++;
            }
            else if(x.startsWith("#####")) {
                co.title = x.substring(5).trim();
            }
            else if(x.startsWith("###")) {
                content += "<h3>" + sec + "." + subsec + "." + subsubsec + ". " + x.substring(3).trim() + "</h3>\n";
                subsubsec += 1;
            }
            else if(x.startsWith("##")) {
                content += "<h2>" + sec + "." + subsec + ". " + x.substring(2).trim() + "</h2>\n";
                subsec += 1;
                subsubsec = 1;
            }
            else if(x.startsWith("#")) {
                content += "<h1>" + sec + ". " + x.substring(1).trim() + "</h1>\n"
                sec += 1;
                subsec = 1;
                subsubsec = 1;
                definition = 1;
            }
            else if(x.startsWith("---")) {
                parsing_box = !parsing_box;
                if(parsing_box == false) {
                    if(boxtype === "sell") {
                        let q = new quiz.SellQuiz();
                        q.id = co.sellQuizzes.length;
                        q.src = box;
                        co.sellQuizzes.push(q);
                        content += "<div id=\"sellquiz-" + q.id + "\"></div>\n";
                    } else if(boxtype === "stack") {
                        let q = new quiz.StackQuiz();
                        q.id = co.stackQuizzes.length;
                        co.stackQuizzes.push(q);
                        let state = "";
                        let lines = box.split("\n");
                        for(let i=0; i<lines.length; i++) {
                            let line = lines[i];
                            if(i==0) {
                                q.title = line;
                            } else if(line.startsWith("@code")) {
                                state = "code";
                            } else if(line.startsWith("@text")) {
                                state = "text";
                            } else if(line.startsWith("@solution")) {
                                state = "solution";
                            } else if(line.startsWith("@")) {
                                q.error = "error: unknown part '" + line + "'";
                                break;
                            } else if(state === "code") {
                                q.code += line + "\n";
                            } else if(state === "text") {
                                q.text += line + "\n";
                            } else if(state === "solution") {
                                q.solutiontext += line + "\n";
                            } else if(line.trim().length > 0) {
                                q.error = "unexpected line '" + line + "'";
                                break;
                            }                        
                        }
                        if(q.error.length == 0) {
                            // parse text
                            let y = this.compile(q.text, false);
                            q.text = y.html;
                            // parse solution text
                            y = this.compile(q.solutiontext, false);
                            q.solutiontext = y.html; 
                            // fix code. TODO: fix STACK random functions!!
                            let lines = q.code.split("\n");
                            q.code = "display2d:false;\n";
                            q.code += "stardisp:true;\n";
                            for(let i=0; i<lines.length; i++) {
                                let line = lines[i].trim();
                                if(line.length == 0)
                                    continue;
                                if(line.endsWith(";") == false)
                                    line += ";";
                                q.code += line + "\n";
                            }
                            q.code += "values;\n";
                            q.code += "ev(values);\n";
                        }
                        //console.log(q);
                        content += "<div id=\"stackquiz-" + q.id + "\"></div>\n";
                    } else {
                        content += "<div class=\"card border-dark\">";
                        content += "<div class=\"card-body\">\n";
    
                        let box_title = "";
                        let no = "";
                        if(["def","theorem"].includes(boxtype)) {
                            no = " " + (sec-1) + "." + definition;
                            definition ++;
                        }
                        if(boxtype.length > 0)
                            box_title = "<b>" + lang.text(boxtype) + no + "</b> ";
    
                        let y = this.compile(box, false);
                        if(y.html.startsWith("<p>"))
                            y.html = "<p>" + box_title + y.html.substring(3);
                        else
                            y.html= box_title + y.html;
    
                        content += y.html;
    
                        content += "</div>\n"; // end of card body
                        content += "</div>\n"; // end of card
                    }
                    box = "";
                } else {
                    boxtype = "";
                }
            }
            else {
                content += "<p>" + x.replaceAll("$","`") + "</p>\n";
            }
        }
    
        if(rootCall) {
            co.html = template.replaceAll("$TITLE$", co.title)
            co.html = co.html.replaceAll("$LEADTEXT$", leadtext)
            co.html = co.html.replaceAll("$CONTENT$", content)
        } else {
            co.html = content;
        }
        
        //console.log(output);
        return co;
    }
    
}
