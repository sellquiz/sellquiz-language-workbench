/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';

export class LinkEntry {
    title = '';
    ref = '';
}

export class PartLinks extends Part {
    links: LinkEntry[] = [];
    generateDOM(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        rootElement.appendChild(divContainer);
        for (const link of this.links) {
            const divRow = document.createElement('div');
            divContainer.appendChild(divRow);
            divRow.classList.add('row');
            const divCol = document.createElement('div');
            divRow.appendChild(divCol);
            divCol.classList.add('col', 'my-1', 'text-center');
            const button = document.createElement('button');
            divCol.appendChild(button);
            button.type = 'button';
            button.classList.add('btn', 'btn-sm', 'btn-dark');
            button.innerHTML = link.title;
        }
    }
    import(data: any): void {
        for (const l of data['links']) {
            const linkInstance = new LinkEntry();
            this.links.push(linkInstance);
            linkInstance.title = l['title'];
            linkInstance.ref = l['ref'];
        }
    }
}
