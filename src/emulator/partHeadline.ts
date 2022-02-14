/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';

export class PartHeadline extends Part {
    text = '';
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
        divCol.innerHTML = '<br/><h2>' + this.text + '</h2>';
    }
    import(data: any): void {
        this.text = data['text'];
    }
}
