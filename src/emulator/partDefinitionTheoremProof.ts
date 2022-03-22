/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';
import { CoursePage } from './coursePage';

export enum Type {
    Definition,
    Theorem,
    Proof,
}

export class PartDefinitionTheoremProof extends Part {
    text = '';
    type = Type.Definition;
    constructor(coursePage: CoursePage) {
        super(coursePage);
        this.allowReadFlag = true;
    }
    generateDOM(rootElement: HTMLElement): void {
        // TODO: remove duplicate code in "generate" from all parts...
        const divContainer = document.createElement('div');
        divContainer.style.cursor = 'pointer';
        this.htmlElement = divContainer;
        divContainer.classList.add('container-fluid');
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-0');
        divRow.appendChild(divCol);
        const headline = document.createElement('p');
        headline.classList.add(
            'text-start',
            'lead',
            'py-0',
            'my-0',
            'my-1',
            'bg-dark',
            'text-light',
            'rounded',
        );
        switch (this.type) {
            case Type.Definition:
                headline.innerHTML = '&nbsp;<b>Definition</b>';
                break;
            case Type.Theorem:
                headline.innerHTML = '&nbsp;<b>Satz</b>';
                break;
            case Type.Proof:
                headline.innerHTML = '&nbsp;<b>Beweis</b>';
                break;
        }
        divCol.appendChild(headline);
        const text = document.createElement('p');
        text.classList.add('px-1', 'py-0', 'my-0');
        text.innerHTML = this.text;
        text.style.borderBottomStyle = 'solid';
        text.style.borderWidth = '2px';
        divCol.appendChild(text);
        this.addReadEventListener(divContainer);
    }
    import(data: any): void {
        this.text = data['text'];
        this.text = this.coursePage.getMathJaxInst().convertHTML(this.text);
    }
}
