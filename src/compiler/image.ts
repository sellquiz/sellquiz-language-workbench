/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import fs from 'fs';
import { execSync } from 'child_process';

import { JSONType, makeTempDirectory, deleteTempDirectory } from './help';
import { Part, PartType } from './part';
import { TIKZ_PROG } from './strings';

export class Image {
    private dataBase64 = '';
    compileImage(part: Part): void {
        part.type = PartType.image;
        const tmpDir = makeTempDirectory();
        let res = '';
        const code = part.labeledText[''];
        const prog = TIKZ_PROG.replace('$CODE$', code);
        fs.writeFileSync(tmpDir + 'image.tex', prog);
        try {
            res = execSync(
                'cd ' +
                    tmpDir +
                    ' && pdflatex -halt-on-error --enable-pipes --shell-escape ' +
                    tmpDir +
                    'image.tex',
                {
                    encoding: 'utf-8',
                    timeout: 10000,
                    stdio: 'pipe',
                },
            );
        } catch (e) {
            part.error = true;
            part.text = (e as any)['stderr'];
            console.log(part.text);
        }
        if (part.error == false) {
            try {
                res = execSync(
                    'pdf2svg ' + tmpDir + 'image.pdf ' + tmpDir + 'image.svg',
                    {
                        encoding: 'utf-8',
                        timeout: 10000,
                        stdio: 'pipe',
                    },
                );
            } catch (e) {
                part.error = true;
                part.text = (e as any)['stderr'];
                console.log(part.text);
            }
        }
        if (part.error == false) {
            this.dataBase64 =
                'data:image/svg+xml;base64,' +
                fs.readFileSync(tmpDir + 'image.svg', 'base64');
        }
        deleteTempDirectory(tmpDir);
    }
    toJson(json: JSONType): void {
        json['data'] = this.dataBase64;
    }
}
