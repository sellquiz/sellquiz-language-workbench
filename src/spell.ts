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

import axios from 'axios';
import nspell from 'nspell';

import * as slw from './index';

// TODO: compression of dicts, i.e. enable lz-string!!!

//let LZString = require('lz-string');
//import {decompress} from 'lz-string';
//import * as LZString from 'lz-string';

export class Spell {

    aff : {[key:string]:any} = {};
    dic : {[key:string]:any} = {};
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
        const this_ = this;
        // load 'aff'
        axios.post('node_modules/dictionary-' + lang + '/index.aff', new URLSearchParams({
        }))
        .then(function(response) {
            const data = response.data;
            this_.aff[lang] = data; // LZString.decompress(data);
            // load 'dic
            axios.post("node_modules/dictionary-" + lang + "/index.dic", new URLSearchParams({
            }))
            .then(function(response) {
                const data = response.data;
                this_.dic[lang] = data; // LZString.decompress(data);
                this_.spell = nspell(this_.aff["en"], this_.dic["en"]);
                slw.update();
            })
            .catch(function(error) {
                console.error(error); // TODO: error handling!
            });
        })
        .catch(function(error) {
            console.error(error); // TODO: error handling!
        });
        return true;
    }

}
