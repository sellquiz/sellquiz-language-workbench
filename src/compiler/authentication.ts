/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { JSONType } from './help';
import { Part, PartType } from './part';

export class Authentication {
    private database = '';
    private requireMatriculationNumber = false;
    private requireAccessToken = false;

    compileAuthentication(part: Part): void {
        part.type = PartType.authentication;
        // database
        if ('database' in part.labeledText == false) {
            part.error = true;
            part.errorLog += 'missing @database\n';
            return;
        }
        this.database = part.labeledText['database'].trim(); // CHECK validity of string
        // input fields
        if ('input' in part.labeledText) {
            const lines = part.labeledText['input'].trim().split('\n');
            for (const line of lines) {
                switch (line) {
                    case 'matriculation-number':
                        this.requireMatriculationNumber = true;
                        break;
                    case 'access-token':
                        this.requireAccessToken = true;
                        break;
                    default:
                        part.error = true;
                        part.errorLog += 'unknown attribute "' + line + '".';
                        break;
                }
            }
        }
    }

    toJson(json: JSONType): void {
        json['database'] = this.database;
        json['requireMatriculationNumber'] = this.requireMatriculationNumber;
        json['requireAccessToken'] = this.requireAccessToken;
    }
}
