/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { MathJax } from '../shared/mathjax';
import { Part } from './part';
import { PartDefinition } from './partDefinition';
import { PartExample } from './partExample';
import { PartHeadline } from './partHeadline';
import { PartImage } from './partImage';
import { PartLinks } from './partLinks';
import { PartNewPage } from './partNewPage';
import { PartParagraph } from './partParagraph';
import { PartQuestion } from './partQuestion';
import { PartSpeedReview } from './partSpeedReview';
import { PartError } from './partError';
import { PartAuthentication } from './partAuthentication';
import { PartProgrammingQuestion } from './partProgrammingQuestion';

export interface CoursePageOptions {
    renderProgressBars: boolean;
    showQuestionVariables: boolean;
    showQuestionScore: boolean;
    showSolution: boolean;
}

export class CoursePage {
    private title = '';
    private parts: Part[] = [];
    private textProgress = 0;

    private numPages = 1;
    private visiblePageIdx = 0;

    private mathjaxInst: MathJax = null;
    private renderProgressBars = false;
    private showQuestionVariables = false;
    private showQuestionScore = false;
    private showSolution = false;

    constructor(mathjaxInst: MathJax, options: CoursePageOptions) {
        this.mathjaxInst = mathjaxInst;
        this.renderProgressBars = options.renderProgressBars;
        this.showQuestionVariables = options.showQuestionVariables;
        this.showQuestionScore = options.showQuestionScore;
        this.showSolution = options.showSolution;
    }

    getMathJaxInst(): MathJax {
        return this.mathjaxInst;
    }

    getNumPages(): number {
        return this.numPages;
    }

    getVisiblePageIdx(): number {
        return this.visiblePageIdx;
    }

    incrementNumPages(): void {
        this.numPages++;
    }

    updateVisibility(): void {
        for (const part of this.parts) {
            part.updateVisibility();
        }
    }

    set(rootElement: HTMLElement): void {
        const content = rootElement;

        content.appendChild(document.createElement('br'));

        // title
        const divContainer = document.createElement('div');
        divContainer.classList.add('container-fluid');
        divContainer.style.backgroundColor = '#ffffff';
        divContainer.style.cursor = 'pointer';
        content.appendChild(divContainer);
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        divContainer.appendChild(divRow);
        const divCol = document.createElement('div');
        divCol.classList.add('col', 'py-1');
        divRow.appendChild(divCol);
        divCol.innerHTML = '<h1>' + this.title + '</h1>';
        // parts
        for (const part of this.parts) {
            part.generateDOM(content);
        }
        // update visibility
        this.updateVisibility();
        // progress bars
        if (this.renderProgressBars) this.refreshProgressBars();
        // navigation
        if (this.numPages > 1) {
            const nav = document.createElement('div');
            content.appendChild(nav);
            nav.classList.add('text-center');
            nav.appendChild(document.createElement('br'));

            const btnGroup = document.createElement('div');
            nav.appendChild(btnGroup);
            btnGroup.classList.add('btn-group');
            const backwardBtn = document.createElement('button');
            backwardBtn.type = 'button';
            backwardBtn.classList.add('btn', 'btn-dark');
            backwardBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            backwardBtn.addEventListener('click', () => {
                if (this.visiblePageIdx > 0) {
                    this.visiblePageIdx--;
                    this.updateVisibility();
                }
            });
            btnGroup.appendChild(backwardBtn);
            const forwardBtn = document.createElement('button');
            forwardBtn.type = 'button';
            forwardBtn.classList.add('btn', 'btn-dark');
            forwardBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            forwardBtn.addEventListener('click', () => {
                if (this.visiblePageIdx < this.numPages - 1) {
                    this.visiblePageIdx++;
                    this.updateVisibility();
                }
            });
            btnGroup.appendChild(forwardBtn);
        }

        content.appendChild(document.createElement('br'));
        content.appendChild(document.createElement('br'));
    }

    import(json: any): void {
        this.title = json['title'];
        for (const part of json['parts']) {
            let partInstance = null;
            switch (part['type']) {
                case 'authentication':
                    partInstance = new PartAuthentication(this);
                    partInstance.import(part);
                    break;
                case 'headline-1':
                    partInstance = new PartHeadline(this);
                    partInstance.import(part);
                    partInstance.level = 1;
                    break;
                case 'headline-2':
                    partInstance = new PartHeadline(this);
                    partInstance.import(part);
                    partInstance.level = 2;
                    break;
                case 'headline-3':
                    partInstance = new PartHeadline(this);
                    partInstance.import(part);
                    partInstance.level = 3;
                    break;
                case 'paragraph':
                    partInstance = new PartParagraph(this);
                    partInstance.import(part);
                    break;
                case 'new-page':
                    partInstance = new PartNewPage(this);
                    partInstance.import(part);
                    break;
                case 'definition':
                    partInstance = new PartDefinition(this);
                    partInstance.import(part);
                    break;
                case 'image':
                    partInstance = new PartImage(this);
                    partInstance.import(part);
                    break;
                case 'example':
                    partInstance = new PartExample(this);
                    partInstance.import(part);
                    break;
                case 'question':
                    partInstance = new PartQuestion(this);
                    partInstance.showVariables = this.showQuestionVariables;
                    partInstance.showScore = this.showQuestionScore;
                    partInstance.showSolution = this.showSolution;
                    partInstance.import(part);
                    break;
                case 'programming-question':
                    partInstance = new PartProgrammingQuestion(this);
                    partInstance.import(part);
                    break;
                case 'speed-review':
                    partInstance = new PartSpeedReview(this);
                    partInstance.import(part);
                    break;
                case 'links':
                    partInstance = new PartLinks(this);
                    partInstance.import(part);
                    break;
                case 'error':
                    partInstance = new PartError(this);
                    partInstance.import(part);
                    break;
                default:
                    console.assert(
                        false,
                        'unimplemented part type ' + part['type'],
                    );
            }
            this.parts.push(partInstance);
        }
    }

    refreshProgressBars(): void {
        let numTextPartsTotal = 0;
        let numTextPartsRead = 0;
        for (const part of this.parts) {
            if (
                part instanceof PartParagraph ||
                part instanceof PartDefinition ||
                part instanceof PartExample
            ) {
                numTextPartsTotal++;
                numTextPartsRead += part.readFlag ? 1 : 0;
            }
        }
        this.textProgress = Math.round(
            (100 * numTextPartsRead) / numTextPartsTotal,
        );
        let renderedTextProgress = this.textProgress;
        if (renderedTextProgress == 0) renderedTextProgress = 10;
        const div = document.getElementById('progress-bars');
        div.innerHTML =
            `
        <div id="text-progress" class="progress bg-white">
            <div class="progress-bar" role="progressbar" style="width: ` +
            renderedTextProgress +
            `%; background-color:#cd121b;" aria-valuenow="` +
            renderedTextProgress +
            `" aria-valuemin="0" aria-valuemax="100">Text</div>
        </div>
        <div class="progress bg-white">
            <div class="progress-bar" role="progressbar" style="width: 75%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">Aufgaben</div>
        </div>
        <div class="progress bg-white">
            <div class="progress-bar" role="progressbar" style="width: 100%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Spiele</div>
        </div>
        `;
    }
}
