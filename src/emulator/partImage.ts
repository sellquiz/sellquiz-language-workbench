/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';

export class PartImage extends Part {
    data = '';
    generateDOM(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
        divContainer.classList.add('container-fluid');
        rootElement.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1', 'text-center');
        divRow.appendChild(divCol);
        const imgElement = document.createElement('img');
        divCol.appendChild(imgElement);
        imgElement.src = this.data;
        imgElement.classList.add('mx-auto', 'd-block');
    }
    import(data: any): void {
        this.data = data['data'];
    }
}
