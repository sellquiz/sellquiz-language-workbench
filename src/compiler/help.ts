/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import os from 'os';
import path from 'path';
import fs from 'fs';

export interface JSONType {
    [name: string]:
        | string
        | string[]
        | string[][]
        | number
        | number[]
        | boolean
        | boolean[]
        | JSONType
        | JSONType[];
}

export function makeTempDirectory(): string {
    const tmp =
        os.tmpdir() +
        path.sep +
        'sellquiz-language-workbench' +
        path.sep +
        Math.floor(Math.random() * 1e15).toString() +
        path.sep;
    fs.mkdirSync(tmp, { recursive: true });
    return tmp;
}

export function deleteTempDirectory(dir: string): void {
    fs.rmSync(dir, {
        recursive: true,
        force: true,
    });
}
