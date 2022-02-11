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

// code partly taken from https://codesandbox.io/s/vwffw?file=/index.js

import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { LiteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { MathDocument } from 'mathjax-full/js/core/MathDocument.js';

export class MathJax {
    adaptor: LiteAdaptor = null;
    html: MathDocument<any, any, any> = null;

    constructor() {
        this.adaptor = new LiteAdaptor();
        RegisterHTMLHandler(this.adaptor);
        this.html = mathjax.document('', {
            InputJax: new TeX({ packages: AllPackages }),
            OutputJax: new SVG({ fontCache: 'none' }),
        });
    }

    convertHTML(htmlIn: string): string {
        let htmlOut = '';
        let eqn = '';
        let isEqn = false;
        const n = htmlIn.length;
        for (let i = 0; i < n; i++) {
            const ch = htmlIn[i];
            const ch2 = i + 1 < n ? htmlIn[i + 1] : '';
            if (ch == '\\' && ch2 == '(') {
                isEqn = true;
                i++;
                continue;
            } else if (ch == '\\' && ch2 == ')') {
                isEqn = false;
                i++;
                if (eqn.length > 0) {
                    htmlOut += this.tex2svgInline(eqn);
                }
                eqn = '';
                continue;
            }
            if (isEqn) eqn += ch;
            else htmlOut += ch;
        }
        return htmlOut;
    }

    tex2svgInline(equation: string): string {
        return this.adaptor.innerHTML(
            this.html.convert(equation, { display: false }),
        );
    }

    tex2svgBlock(equation: string): string {
        return this.adaptor.innerHTML(
            this.html.convert(equation, { display: true }),
        );
    }
}

//const blub = tex2svg('\\sum^N_i x_i+y_i \\xrightarrow{3}', true);
//console.log(blub);
