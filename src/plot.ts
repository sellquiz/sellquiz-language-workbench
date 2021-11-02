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

export class Plot2d {

    id = 0;

    title = "";
    src = "";

    constructor() {
    }

    error(message : string) {
        let imgElement = document.getElementById("plot2d-img-" + this.id);
        imgElement.innerHTML = "<p class=\"text-danger\">Error: " + message + "</p>";
    }

    refresh() {
        let imgElement = document.getElementById("plot2d-img-" + this.id);
        // TODO: asciimath to tex
        let tex = `\\documentclass[class=minimal,border=0pt]{standalone}
\\usepackage[latin1]{inputenc}
\\usepackage{tikz}
\\begin{document}
\\pagestyle{empty}
\\begin{tikzpicture}[domain=_X_START_:_X_END_]
    \\draw[very thin,color=gray] _GRID_START_ grid _GRID_END_;
    \\draw[->] _X_AXIS_START_ -- _X_AXIS_END_ node[right] {$x$};
    \\draw[->] _Y_AXIS_START_ -- _Y_AXIS_END_ node[above] {$y$};
_FUNCTIONS_
\\end{tikzpicture}
\\end{document}
`;
        // create LaTeX file
        let x1 = -1;
        let x2 = 1;
        let y1 = -1;
        let y2 = 1;
        let functions = "";
        let function_idx = 0;
        let lines = this.src.split("\n");
        for(let i=0; i<lines.length; i++) {
            let line = lines[i];
            if(line.trim().length == 0)
                continue;
            if(line.startsWith("xaxis") || line.startsWith("yaxis")) {
                let isXAxis = line.startsWith("xaxis");
                let values = line.substr(5).trim().split(",");
                if(values.length != 2 
                        || isNaN(parseFloat(values[0])) 
                        || isNaN(parseFloat(values[1]))   ) {
                    this.error("Definition of 'xaxis' must have format 'xaxis START, END'");
                    return;
                }
                if(isXAxis) {
                    x1 = parseFloat(values[0]);
                    x2 = parseFloat(values[1]);
                } else {
                    y1 = parseFloat(values[0]);
                    y2 = parseFloat(values[1]);
                }
            } else if(line.startsWith("plot")) {
                // TODO: must check, if term is correct!
                let tokens = line.substr(4).trim().split("=");
                if(tokens.length != 2) {
                    this.error("Definition of 'plot' must have format 'plot ID = TERM'");
                    return;
                }
                let id = tokens[0].trim();
                let fct = tokens[1].trim();
                let colors = ["red", "blue", "orange"]; // TODO
                functions += "\t\\draw[color=" + colors[function_idx % colors.length] + "] plot function{" + fct + "}\n";
                functions += "\t\tnode[right] {$" + id + "$};\n";
                function_idx ++;
            } else {
                this.error("unknown command in line: '" + line + "'");
                return;
            }
        }
        tex = tex.replaceAll("_X_START_", ""+(x1));
        tex = tex.replaceAll("_X_END_", ""+(x2));
        tex = tex.replaceAll("_GRID_START_", "("+(x1-0.1)+","+(y1-0.1)+")");
        tex = tex.replaceAll("_GRID_END_", "("+(x2+0.1)+","+(y2+0.1)+")");
        tex = tex.replaceAll("_X_AXIS_START_", "("+(x1-0.2)+","+(0.0)+")");
        tex = tex.replaceAll("_X_AXIS_END_", "("+(x2+0.2)+","+(0.0)+")");
        tex = tex.replaceAll("_Y_AXIS_START_", "("+(0)+","+(y1-0.2)+")");
        tex = tex.replaceAll("_Y_AXIS_END_", "("+(0)+","+(y2+0.2)+")");
        tex = tex.replaceAll("_FUNCTIONS_", functions);

        // render via LaTeX + Gnuplot
        let service_url = "../services/plot2d.php";
        $.ajax({
            type: "POST",
            url: service_url,
            data: {
                input: tex
            },
            success: function(data) {
                // TODO: image size
                imgElement.innerHTML = "<img src=\"" + data 
                    + "\" class=\"img-fluid\" width=\"320px\"/>";
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
            + this.title + "</span><br/>\n";

        html += '<p id="plot2d-img-' + this.id + '"></p>';

        html += "</div>\n"; // end of card footer
        html += "</div>\n"; // end of card

        document.getElementById("plot2d-" + this.id).innerHTML = html;
    }

}
