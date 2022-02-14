/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import axios from 'axios';

import { CoursePage } from './coursePage';
import { Chat } from './chat';
import { MathJax } from '../shared/mathjax';

const mathjaxInstance = new MathJax();

const chatInstance = new Chat();

const COURSE_DEF_PATH = 'data/courses/demo/demo-app-complex-1.json';
const CHAT_DEF_PATH = 'data/courses/demo/demo-app-chat.json';

const coursePage = new CoursePage(mathjaxInstance);

export function init() {
    loadPage(COURSE_DEF_PATH);
    // get chat definition
    axios
        .get(CHAT_DEF_PATH)
        .then(function (response) {
            const data = response.data;
            chatInstance.import(data);
            // TODO: next line is a test!
            //chatInstance.triggerQuestion();
        })
        .catch(function (error) {
            console.error(error); // TODO: error handling!
        });
}

function loadPage(path: string) {
    // get course page definition
    axios
        .get(path)
        .then(function (response) {
            const data = response.data;
            // import
            coursePage.import(data);
            coursePage.set(document.getElementById('content'));
        })
        .catch(function (error) {
            console.error(error); // TODO: error handling!
        });
}

export function getChatHistory(): string[] {
    return chatInstance.getChatHistory();
}

export function sendChatMessage(msg: string): void {
    chatInstance.chat(msg);
}

/*
import fs from 'fs';
const data = fs.readFileSync(
    'data/courses/demo/demo-app-complex-1.json',
    'utf-8',
);
const page = new CoursePage();
page.import(JSON.parse(data));
*/
