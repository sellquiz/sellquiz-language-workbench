/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import axios from 'axios';

import { CoursePage } from './coursePage';
import { MathJax } from '../shared/mathjax';

const mathjaxInstance = new MathJax();
const coursePage = new CoursePage(mathjaxInstance, {
    renderProgressBars: false,
    showQuestionVariables: false,
    showQuestionScore: false,
    showSolution: false,
});

export function initBase64(id: string): void {
    id = window.atob(id);
    const tokens = id.split('#');
    const serverName = tokens[0];
    const courseName = tokens[1];
    const documentName = tokens[2];
    init(serverName, courseName, documentName);
}

export function init(
    serverName: string,
    courseName: string,
    documentName: string,
): void {
    axios
        .post(
            'services/service.php',
            new URLSearchParams({
                command: JSON.stringify({
                    type: 'get_emulator_document',
                    query_values: {
                        serverName: serverName,
                        courseName: courseName,
                        documentName: documentName,
                    },
                }),
            }),
        )
        .then(function (response) {
            const data = response.data;
            // TODO: check data.error
            console.log(data);

            const compiled = data.rows[0][0];
            init2(compiled);
        })
        .catch(function (error) {
            // TODO
            console.log(error);
        });
}

function init2(compiled: string): void {
    coursePage.import(JSON.parse(compiled));
    const content = document.getElementById('content');
    content.innerHTML = '';
    coursePage.set(content);
}
