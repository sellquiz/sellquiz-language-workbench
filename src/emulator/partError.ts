/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';
import { CoursePage } from './coursePage';

export class PartError extends Part {
    text = '';
    constructor(coursePage: CoursePage) {
        super(coursePage);
        this.allowReadFlag = true;
    }
    generateDOM(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1');
        divRow.appendChild(divCol);
        const headline = document.createElement('p');
        headline.classList.add('text-start', 'lead', 'py-0', 'my-0', 'my-1');
        headline.innerHTML = '<b>ERROR</b>';
        divCol.appendChild(headline);
        const text = document.createElement('p');
        text.innerHTML = this.text;
        divCol.appendChild(text);
    }
    import(data: any): void {
        this.text = data['text'];
    }
}
