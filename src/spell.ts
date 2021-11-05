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

import nspell from 'nspell';

import * as slw from './index.js';

// TODO: compression of dicts, i.e. enable lz-string!!!

//let LZString = require('lz-string');
//import {decompress} from 'lz-string';
//import * as LZString from 'lz-string';

export class Spell {

    aff = {};
    dic = {};
    spell : any = null; // TODO: multiple languages

    constructor() {
        this.load();
    }

    isCorrect(word : string) : boolean {
        if(this.spell == null)
            return true;
        return this.spell.correct(word);
    }

    getSuggestions(word : string) : Array<string> {
        return this.spell.suggest(word);
    }

    load(lang="en") : boolean {
        let this_ = this;
        // load 'aff'
        $.ajax({
            type: "POST",
            dataType: "text",
            mimeType: 'text/plain; charset=x-user-defined',
            //url: "../cache/dict-" + lang + "-compr.aff",
            url: "../node_modules/dictionary-" + lang + "/index.aff",
            data: { },
            success: function(data) {
                this_.aff[lang] = data; // LZString.decompress(data);
                // load 'dic
                $.ajax({
                    type: "POST",
                    dataType: "text",
                    mimeType: 'text/plain; charset=x-user-defined',
                    //url: "../cache/dict-" + lang + "-compr.dic",
                    url: "../node_modules/dictionary-" + lang + "/index.dic",
                    data: { },
                    success: function(data) {
                        this_.dic[lang] = data; // LZString.decompress(data);
                        this_.spell = nspell(this_.aff["en"], this_.dic["en"]);
                        slw.update();
                    },
                    error: function(xhr, status, error) {
                        console.error(xhr); // TODO: error handling!
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error(xhr); // TODO: error handling!
            }
        });
        return true;
    }

}
