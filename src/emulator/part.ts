/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { CoursePage } from './coursePage';

export abstract class Part {
    coursePage: CoursePage;
    index = 0;
    allowReadFlag = false;
    readFlag = false;
    pageIdx = 0;
    htmlElement: HTMLElement = null; // root
    static indexCounter = 0;
    constructor(coursePage: CoursePage) {
        this.coursePage = coursePage;
        this.index = Part.indexCounter++;
        this.pageIdx = coursePage == null ? -1 : coursePage.getNumPages() - 1;
    }
    abstract import(data: any): void;
    abstract generateDOM(rootElement: HTMLElement): void;
    addReadEventListener(element: HTMLElement): void {
        const this_ = this;
        if (this.allowReadFlag) {
            element.addEventListener('click', (event) => {
                this_.readFlag = !this_.readFlag;
                if (this_.readFlag) {
                    element.style.backgroundColor = '#d0ffd0';
                } else {
                    element.style.backgroundColor = '#ffffff';
                }
                this_.coursePage.refreshProgressBars();
            });
        }
    }
    updateVisibility(): void {
        if (this.htmlElement == null) return;
        if (this.coursePage.getVisiblePageIdx() == this.pageIdx) {
            this.htmlElement.style.display = 'block';
            //console.log('block');
        } else {
            this.htmlElement.style.display = 'none';
            //console.log('none');
        }
    }
}
