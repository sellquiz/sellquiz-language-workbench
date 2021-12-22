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

// TODO: must clear cache
const cache : {[code:string]:string} = {};

export enum PlotType {
    Plot2d,
    PlotTikz
}

export class Plot {

    id = 0;

    type : PlotType = PlotType.PlotTikz;

    title = "";
    src = "";
    tex = "";

    error(message : string) {
        const imgElement = document.getElementById("plot-img-" + this.id);
        imgElement.innerHTML = "<p class=\"text-danger\">Error: " + message + "</p>";
    }

    setImage(data : string) {
        const imgElement = document.getElementById("plot-img-" + this.id);
        // TODO: image size
        imgElement.innerHTML = "<img src=\"" + data
        + "\" class=\"img-fluid\" width=\"320px\"/>";
    }

    refresh() {
        if(this.src in cache) {
            this.setImage(cache[this.src]);
            return;
        }
        if(this.type == PlotType.Plot2d)
            this.refreshPlot2d();
        else if(this.type == PlotType.PlotTikz)
            this.refreshPlotTikz();
        // render via LaTeX + Gnuplot
        const service_url = "services/plot.php";
        const this_ = this;
console.log(this.tex);
        $.ajax({
            type: "POST",
            url: service_url,
            data: {
                input: this.tex
            },
            success: function(data) {
                cache[this_.src] = data;
                this_.setImage(data);
            },
            error: function(xhr, status, error) {
                console.error(xhr); // TODO: error handling!
            }
        });
    }

    refreshPlotTikz() {
        this.tex = `\\documentclass[class=minimal,border=0pt]{standalone}
\\usepackage[latin1]{inputenc}
\\usepackage{tikz}
\\begin{document}
\\pagestyle{empty}
\\begin{tikzpicture}`+ this.src + `
\\end{tikzpicture}
\\end{document}
`;
    }

    refreshPlot2d() {
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
        const lines = this.src.split("\n");
        for(let i=0; i<lines.length; i++) {
            const line = lines[i];
            if(line.trim().length == 0)
                continue;
            if(line.startsWith("xaxis") || line.startsWith("yaxis")) {
                const isXAxis = line.startsWith("xaxis");
                const values = line.substr(5).trim().split(",");
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
                const tokens = line.substr(4).trim().split("=");
                if(tokens.length != 2) {
                    this.error("Definition of 'plot' must have format 'plot ID = TERM'");
                    return;
                }
                const id = tokens[0].trim();
                const fct = tokens[1].trim();
                const colors = ["red", "blue", "orange"]; // TODO
                functions += "\t\\draw[color=" + colors[function_idx % colors.length] + "] plot function{" + fct + "}\n";
                functions += "\t\tnode[right] {$" + id + "$};\n";
                function_idx ++;
            } else {
                this.error("unknown command in line: '" + line + "'");
                return;
            }
        }
        tex = tex.replace(/_X_START_/g, ""+(x1));
        tex = tex.replace(/_X_END_/g, ""+(x2));
        tex = tex.replace(/_GRID_START_/g, "("+(x1-0.1)+","+(y1-0.1)+")");
        tex = tex.replace(/_GRID_END_/g, "("+(x2+0.1)+","+(y2+0.1)+")");
        tex = tex.replace(/_X_AXIS_START_/g, "("+(x1-0.2)+","+(0.0)+")");
        tex = tex.replace(/_X_AXIS_END_/g, "("+(x2+0.2)+","+(0.0)+")");
        tex = tex.replace(/_Y_AXIS_START_/g, "("+(0)+","+(y1-0.2)+")");
        tex = tex.replace(/_Y_AXIS_END_/g, "("+(0)+","+(y2+0.2)+")");
        tex = tex.replace(/_FUNCTIONS_/g, functions);
        this.tex = tex;
    }

    updateHTML() {
        let html = "";

        html += "<div class=\"card border-dark\">";
        html += "<div class=\"card-body\">\n";

        html += "<span class=\"h2 py-1 my-1\">"
            + this.title + "</span><br/>\n";

        html += '<p id="plot-img-' + this.id + '"></p>';

        html += "</div>\n"; // end of card footer
        html += "</div>\n"; // end of card

        document.getElementById("plot-" + this.id).innerHTML = html;
    }

}
