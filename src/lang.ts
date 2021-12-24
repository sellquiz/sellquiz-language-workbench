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

export const language = "en";

export const checkmark = ' &#x2705; ';
export const crossmark = ' &#x274C; ';

const lang_str : {[key:string]:string} = {
    "definition_en": "Definition",
    "definition_de": "Definition",
    "theorem_en": "Theorem",
    "theorem_de": "Satz",
    "remark_en": "Remark",
    "remark_de": "Bemerkung",
    "please_wait_en": "please wait...",
    "please_wait_de": "bitte warten...",
    "evaluate_en": "Evaluate",
    "evaluate_de": "Auswerten",
    "solution_en": "Solution",
    "solution_de": "Lösung",
    "variables_en": "Variables",
    "variables_de": "Variablen",
    "syntax_error_en": "Syntax error",
    "syntax_error_de": "Syntaxfehler"
};

export function text(id : string) : string {
    if(!((id + "_" + language) in lang_str))
        return "LANG.text('" + id + "'): unknown!";
    return lang_str[id + "_" + language];
}

export function red_text(id : string) : string {
    return '<span class="text-danger">' + text(id) + '</span>';
}