/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';

export class PartHeadline extends Part {
    text = '';
    level = 1;
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
        switch (this.level) {
            case 1:
                divCol.innerHTML = '<br/><h2><b>' + this.text + '</b></h2>';
                break;
            case 2:
                divCol.innerHTML = '<br/><h3><b>' + this.text + '</b></h3>';
                break;
            default:
                divCol.innerHTML = '<br/><h4>' + this.text + '</h4>';
                break;
        }
    }
    import(data: any): void {
        this.text = data['text'];
    }
}
