/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';
import { CoursePage } from './coursePage';

export class PartAuthentication extends Part {
    database = '';
    requireMatriculationNumber = false;
    requireAccessToken = false;

    constructor(coursePage: CoursePage) {
        super(coursePage);
    }

    generateDOM(rootElement: HTMLElement): void {
        const divContainer = document.createElement('div');
        this.htmlElement = divContainer;
        divContainer.classList.add('container-fluid');
        rootElement.appendChild(divContainer);

        divContainer.innerHTML = `
        <div class="row">
            <div class="col-md-5 mx-0">
                <div class="input-group px-0 mx-0">
                    <span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-user"></i></span>
                    <input type="text" class="form-control" placeholder="Matrikelnummer (letzte 4 Ziffern)">
                </div>
            </div>
            <div class="col-md-5 mx-0">
                <div class="input-group px-0 mx-0">
                    <span class="input-group-text" id="basic-addon1"><i class="fa-solid fa-key"></i></span>
                    <input type="text" class="form-control" placeholder="Zugangstoken">
                </div>
            </div>
            <div class="col-md-2 px-0 mx-0">
                <button type="button" class="btn btn-primary mx-0">Bestätigen</button>
            </div>
        </div>
        <br/>`;

        /*divContainer.style.cursor = 'pointer';
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
        headline.innerHTML = '&nbsp;<b>Definition</b>';
        divCol.appendChild(headline);
        const text = document.createElement('p');
        text.classList.add('px-1', 'py-0', 'my-0');
        text.innerHTML = this.text;
        text.style.borderBottomStyle = 'solid';
        text.style.borderWidth = '2px';
        divCol.appendChild(text);
        this.addReadEventListener(divContainer);*/
    }

    import(data: any): void {
        this.database = data['database'];
        this.requireMatriculationNumber = data['requireMatriculationNumber'];
        this.requireAccessToken = data['requireAccessToken'];
    }
}
