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

import * as lang from './lang';
import * as quiz from './quiz';
import * as prog from './prog';
import * as plot from './plot';
import { spellInst } from './index';

export class Reference {
    shortname = "";
    name = "";
    label = "";
}

export class CompilerOutput {

    title = "";
    html = "";

    sellQuizzes : Array<quiz.SellQuiz> = [];
    stackQuizzes : Array<quiz.StackQuiz> = [];
    programmingQuizzes : Array<prog.ProgrammingQuiz>  = [];
    plots : Array<plot.Plot> = [];
    references : {[name:string]:Reference} = {};

    refresh() {
        for(const q of this.stackQuizzes) {
            q.updateHTML();
            q.refresh();
        }
        for(const p of this.programmingQuizzes) {
            p.updateHTML();
            p.refresh();
        }
        for(const p of this.plots) {
            p.updateHTML();
            p.refresh();
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

    spellCheck=false;

    compile(input_str : string, rootCall=true) : CompilerOutput {
        const co = new CompilerOutput();

        const input = input_str.split("\n");
        const leadtext = "";
        let content = "";

        // numbering
        let sec = 1;
        let subsec = 1;
        let subsubsec = 1;
        let definition = 1;
        let eqn = 1;

        const block_types = [
            "definition",
            "theorem",
            "remark",
            "question",
            "javablock",
            "python",
            "plot2d",
            "tikz"
        ];

        let unorderedItems = [];
        let orderedItems = [];
        let box = "";
        let boxStartLine = 0;
        let boxType = "";
        let parsingBox = false;

        for(let i=0; i<input.length; i++) {
            const x = input[i];
            if(x.startsWith("%")) {
                // comment
            }
            else if(parsingBox && !x.startsWith("---")) {
                let known_type = false;
                if(box.length == 0) {
                    for(const type of block_types) {
                        if(x.toLowerCase().startsWith(type + ".")) {
                            boxType = type;
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
            else if(unorderedItems.length > 0 && (x.startsWith(" ") || x.startsWith("\t"))) {
                unorderedItems[unorderedItems.length-1] += x;
            }
            else if(unorderedItems.length > 0 && !x.startsWith("* ")) {
                content += "<ul>";
                for(const item of unorderedItems)
                    content += "<li>" + this.compile_paragraph(item, co) + "</li>";
                content += "</ul>";
                unorderedItems = [];
            }
            else if(orderedItems.length > 0 && (x.startsWith(" ") || x.startsWith("\t"))) {
                orderedItems[orderedItems.length-1] += x;
            }
            else if(orderedItems.length > 0 && !x.startsWith("- ")) {
                content += "<ol>";
                for(const item of orderedItems)
                    content += "<li>" + this.compile_paragraph(item, co) + "</li>";
                content += "</ol>";
                orderedItems = [];
            }
            else if(x.startsWith("* ")) {
                unorderedItems.push(x.substring(2));
            }
            else if(x.startsWith("- ")) {
                orderedItems.push(x.substring(2));
            }
            // centered equation
            else if(x.trim().startsWith("$") && x.length>1 && (x[0]==" "||x[0]=="\t")) {
                content += `
                <div class="" style="position:relative">
                    <p class="text-center" style="position:absolute;width:100%;">
                        ` + this.compile_paragraph(x.trim(), co) + `
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
                // TODO: ref
                content += "<a onclick=\"slw.jump(" + i + ");\" style=\"cursor:pointer;\">";
                content += "<h3>" + sec + "." + subsec + "." + subsubsec + ". " + x.substring(3).trim() + "</h3>\n";
                content += "</a>\n";
                subsubsec += 1;
            }
            else if(x.startsWith("##")) {
                // TODO: ref
                content += "<a onclick=\"slw.jump(" + i + ");\" style=\"cursor:pointer;\">";
                content += "<h2>" + sec + "." + subsec + ". " + x.substring(2).trim() + "</h2>\n";
                content += "</a>\n";
                subsec += 1;
                subsubsec = 1;
            }
            else if(x.startsWith("#")) {
                let name="", label="";
                [name, label] = this.extract_name_and_label(x.substring(1).trim());
                if(label.length > 0) {
                    const ref = new Reference();
                    ref.shortname = "" + sec;
                    ref.name = name;
                    ref.label = label;
                    co.references[label] = ref;
                }
                content += "<a onclick=\"slw.jump(" + i + ");\" style=\"cursor:pointer;\">";
                content += "<h1>" + sec + ". " + name + "</h1>";
                content += "</a>\n";
                sec += 1;
                subsec = 1;
                subsubsec = 1;
                definition = 1;
            }
            else if(x.startsWith("---")) {
                parsingBox = !parsingBox;
                if(parsingBox == false) {
                    if(boxType === "sell") {
                        const q = new quiz.SellQuiz();
                        q.id = co.sellQuizzes.length;
                        q.src = box;
                        co.sellQuizzes.push(q);
                        content += "<div id=\"sellquiz-" + q.id + "\"></div>\n";
                    } else if(boxType === "plot2d" || boxType === "tikz") {
                        const p = new plot.Plot();
                        p.type = boxType === "plot2d" ?
                            plot.PlotType.Plot2d : plot.PlotType.PlotTikz;
                        p.id = co.plots.length;
                        p.title = "";
                        p.src = "";
                        const lines = box.split("\n");
                        for(let i=0; i<lines.length; i++) {
                            if(i==0)
                                p.title = lines[i];
                            else
                                p.src += lines[i] + "\n";
                        }
                        co.plots.push(p);
                        content += "<div id=\"plot-" + p.id + "\"></div>\n";
                    } else if(boxType === "javablock" || boxType === "python") {
                        const parts = this.compile_box_parts(box, [
                            "@text", "@given", "@asserts", "@forbidden-keywords",
                            "@required-keywords", "@solution"]);
                        if(parts["error"].length > 0) {
                            content += "error: " + parts["error"];
                        } else {
                            const p = new prog.ProgrammingQuiz();
                            p.type = boxType === "javablock" ? prog.ProgrammingQuizType.JavaBlock : prog.ProgrammingQuizType.Python;
                            p.id = co.programmingQuizzes.length;
                            p.title = parts["@title"];
                            p.text = this.compile(parts["@text"], false).html;
                            p.given = this.removeEmptyLines(parts["@given"]);
                            p.asserts = this.removeEmptyLines(parts["@asserts"]).split("\n");
                            p.forbiddenKeywords = this.removeEmptyLines(parts["@forbidden-keywords"]).split("\n");
                            p.requiredKeywords = this.removeEmptyLines(parts["@required-keywords"]).split("\n");
                            p.solution = parts["@solution"];
                            co.programmingQuizzes.push(p);
                            content += "<div id=\"programming-" + p.id + "\"></div>\n";
                        }
                    } else if(boxType === "question") {
                        const q = new quiz.StackQuiz();
                        q.id = co.stackQuizzes.length;
                        co.stackQuizzes.push(q);
                        const parts = this.compile_box_parts(box, ["@tags", "@code", "@text", "@solution"]);
                        q.error = parts["error"];
                        if(q.error.length == 0) {
                            q.title = parts["@title"];
                            q.tagList = this.compile_tags(parts["@tags"]);
                            q.code = parts["@code"];
                            q.text = this.compile(parts["@text"], false).html;
                            q.solutionText = this.compile(parts["@solution"], false).html;
                            q.code = q.compileCode(q.code);
                            q.code += "values;\n";
                            q.code += "ev(values);\n";
                            q.code += "float(ev(values));\n";
                        }
                        content += "<div id=\"stackquiz-" + q.id + "\"></div>\n";
                    } else {
                        content += "<div class=\"card border-dark\">";
                        content += "<div class=\"card-body\">\n";

                        let box_title = "";
                        let no = "";
                        if(["definition","theorem"].includes(boxType)) {
                            no = " " + (sec-1) + "." + definition;
                            definition ++;
                        }
                        if(boxType.length > 0) {
                            box_title = "<a onclick=\"slw.jump(" + boxStartLine + ");\" style=\"cursor:pointer;\">";
                            box_title += "<b>" + lang.text(boxType) + no + "</b> ";
                            box_title += "</a>";
                        }
                        const y = this.compile(box, false);
                        if(y.html.startsWith("<p>"))
                            y.html = "<p>" + box_title + y.html.substring(3);
                        else
                            y.html = box_title + y.html;

                        content += y.html;

                        content += "</div>\n"; // end of card body
                        content += "</div>\n"; // end of card
                    }
                    box = "";
                } else {
                    boxStartLine = i;
                    boxType = "";
                }
            }
            else {
                content += "<p>" + this.compile_paragraph(x, co) + "</p>\n";
            }
        }

        if(rootCall) {
            co.html = template.replace(/\$TITLE\$/g, co.title)
            co.html = co.html.replace(/\$LEADTEXT\$/g, leadtext)
            co.html = co.html.replace(/\$CONTENT\$/g, content)
        } else {
            co.html = content;
        }

        //console.log(output);
        return co;
    }

    extract_name_and_label(x : string) : Array<string> {
        const n = x.length;
        let name = "";
        let label = "";
        let isLabel = false;
        for(let i=0; i<n; i++) {
            const ch = x[i];
            const chAlpha = (ch>='A' && ch<='Z') || (ch>='a' && ch<='z') || ch=='_';
            const chNum = ch>='0' && ch<='9';
            const ch2 = (i+1) < n ? x[i+1] : "";
            const ch2Alpha = (ch2>='A' && ch2<='Z') || (ch2>='a' && ch2<='z') || ch2=='_';
            if(ch == '!' && ch2Alpha) {
                isLabel = true;
            } else if(isLabel) {
                if(chAlpha || chNum)
                    label += ch;
                else {
                    isLabel = false;
                    i --;
                }
            } else {
                name += ch;
            }
        }
        return [name, label];
    }

    compile_tags(x : string) : Array<string> {
        const output : Array<string> = [];
        const y = x.replace(/\n/g, " ").split(" ");
        for(const yi of y) {
            if(yi.length > 0)
                output.push(yi);
        }
        return output;
    }

    compile_paragraph(x : string, co : CompilerOutput) : string {
        let y = "";
        let is_tex = false;
        let is_bold = false;
        let is_italic = false;
        let is_inlineCode = false;
        let is_reference = false;
        let color = "";
        let word = "";
        let reference = "";
        const n = x.length;
        for(let i=0; i<=n; i++) {
            const ch = x[i];
            const isAlpha = (ch>='A' && ch<='Z') || (ch>='a' && ch<='z');
            if(word.length > 0 && (i==n || !isAlpha)) {
                if(this.spellCheck == false || spellInst.isCorrect(word))
                    y += word;
                else
                    y += "<span class=\"border-bottom border-danger\">" + word + "</span>";
                word = "";
            }
            if(i == n)
                break;
            if(is_reference) {
                if(isAlpha || ch=='_') {
                    reference += ch;
                } else {
                    if(reference.length > 0) {
                        const ref = co.references[reference];
                        if(ref == undefined)
                            y += '<a onclick="">UNKNOWN-REFERENCE</a>';
                        else
                            y += '<a href="javascript:slw.gotoRef(\'' + ref.label + '\');">' + ref.shortname + '</a>';
                    }
                    else
                        y += '!';
                    is_reference = false;
                    i --;
                }
            }
            else if(ch === "$") {
                is_tex = !is_tex;
                y += "`";
            } else if(ch === "`") {
                is_inlineCode = !is_inlineCode;
                y += is_inlineCode ? "<code>" : "</code>";
            } else if(!is_inlineCode && !is_tex && ch === "*") {
                is_bold = !is_bold;
                y += is_bold ? "<b>" : "</b>";
            } else if(!is_inlineCode && !is_tex && ch === "_") {
                is_italic = !is_italic;
                y += is_italic ? "<i>" : "</i>";
            } else if(!is_inlineCode && !is_tex && ch === "!") {
                is_reference = true;
                reference = "";
            } else if(x.substr(i).startsWith("red(")) {
                color = "red";
                y += "<span class=\"text-danger\">";
                i += "red".length;
            } else if(x.substr(i).startsWith("green(")) {
                color = "green";
                y += "<span class=\"text-success\">";
                i += "green".length;
            } else if(x.substr(i).startsWith("blue(")) {
                color = "blue";
                y += "<span class=\"text-primary\">";
                i += "blue".length;
            } else if(color.length > 0 && ch === ")") {
                color = "";
                y += "</span>";
            } else if(!is_tex && !is_inlineCode && ((ch>='A'&&ch<='Z') || (ch>='a'&&ch<='z'))) {
                word += ch;
            } else {
                y += ch;
            }
        }
        // clean up unclosed scopes
        if(is_tex)
            y += "`";
        if(is_bold)
            y += "</b>";
        if(is_italic)
            y += "</i>";
        // TODO: is_reference
        if(color.length > 0)
            y += "</span>";
        return y;
    }

    compile_box_parts(input : string, ids : Array<string>) : {[name:string]:string} {
        const parts : {[name:string]:string} = {};
        parts["error"] = "";
        for(const id of ids)
            parts[id] = "";
        let state = "";
        const lines = input.split("\n");
        for(let i=0; i<lines.length; i++) {
            let line = lines[i];
            if(i == 0)
                parts["@title"] = line;
            if(line.trim().length == 0)
                continue;
            if(line.startsWith("@"))
                line = line.trim();
            if(ids.includes(line)) {
                state = line;
                parts[state] = "";
            } else if(line.startsWith("@")) {
                parts["error"] = "error: unknown part '" + line + "'";
            } else {
                parts[state] += line + "\n";
            }
        }
        return parts;
    }

    removeEmptyLines(input : string) : string {
        let output = "";
        const lines = input.split("\n");
        const n = lines.length;
        for(let i=0; i<n; i++) {
            if(lines[i].trim().length > 0) {
                if(output.length > 0)
                    output += "\n";
                output += lines[i];
            }
        }
        return output;
    }

}
