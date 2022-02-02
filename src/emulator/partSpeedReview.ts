/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';

export class SpeedReviewQuestion {
    text = '';
    answers: string[] = [];
    correctIdx = 0;
}

export class PartSpeedReview extends Part {
    htmlContentElement: HTMLElement = null;
    questions: SpeedReviewQuestion[] = [];
    currentQuestionIndex = 0;
    numCorrect = 0;
    startTime: Date;

    private finished() {
        const endTime = new Date();
        const elapsedSeconds =
            (endTime.getTime() - this.startTime.getTime()) / 1000;
        this.htmlContentElement.innerHTML = '';
        const rowElement = document.createElement('div');
        this.htmlContentElement.appendChild(rowElement);
        rowElement.classList.add('row', 'py-1');
        const colElement = document.createElement('div');
        rowElement.appendChild(colElement);
        colElement.classList.add(
            'col',
            'bg-secondary',
            'text-light',
            'rounded',
            'mx-4',
            'pt-2',
        );
        const pElement = document.createElement('p');
        colElement.appendChild(pElement);
        pElement.classList.add('lead', 'py-0');
        pElement.innerHTML =
            '' +
            this.numCorrect +
            ' von ' +
            this.questions.length +
            '<br/> Antworten korrekt<br/><br/>Benötigte Zeit:<br/>' +
            elapsedSeconds +
            ' Sekunden';
    }

    private generateQuestionDOM() {
        const question = this.questions[this.currentQuestionIndex];
        this.htmlContentElement.innerHTML = '';
        // question text
        let rowElement = document.createElement('div');
        this.htmlContentElement.appendChild(rowElement);
        rowElement.classList.add('row', 'py-1');
        const colElement = document.createElement('div');
        rowElement.appendChild(colElement);
        colElement.classList.add(
            'col',
            'bg-secondary',
            'text-light',
            'rounded',
            'mx-4',
            'pt-2',
        );
        const pElement = document.createElement('p');
        colElement.appendChild(pElement);
        pElement.classList.add('lead', 'py-0');
        pElement.innerHTML = question.text;
        // answers
        // TODO: random shuffle answers
        for (let i = 0; i < 4; i++) {
            if (i % 2 == 0) {
                rowElement = document.createElement('div');
                this.htmlContentElement.appendChild(rowElement);
                rowElement.classList.add('row', 'mx-2', 'my-2');
                rowElement.style.height = '50px';
            }
            const colElement = document.createElement('div');
            rowElement.appendChild(colElement);
            colElement.id = 'answer-' + i;
            colElement.classList.add('col', 'text-light', 'rounded', 'mx-2');
            colElement.style.backgroundColor = '#212529';
            colElement.innerHTML = '<br/><b>' + question.answers[i] + '</b>';
            const this_ = this;
            colElement.addEventListener('click', () => {
                //console.log('clicked on answer ' + i);
                const question = this.questions[this.currentQuestionIndex];
                if (question.correctIdx == i) {
                    this.numCorrect++;
                    colElement.style.backgroundColor = 'green';
                    this.currentQuestionIndex++;
                    if (this.currentQuestionIndex >= this.questions.length) {
                        setTimeout(function () {
                            this_.finished();
                        }, 250);
                    } else {
                        setTimeout(function () {
                            this_.generateQuestionDOM();
                        }, 250);
                    }
                } else {
                    colElement.style.backgroundColor = '#cd121b';
                }
            });
        }
    }

    generateDOM(rootElement: HTMLElement): void {
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
            'text-light',
            'rounded',
        );
        headline.innerHTML = '&nbsp;<b>Speed Review</b>';
        headline.style.backgroundColor = '#b42b83';
        divCol.appendChild(headline);

        const text = document.createElement('p');
        this.htmlContentElement = text;
        text.classList.add('px-1', 'py-2', 'my-0', 'text-center');
        text.innerHTML =
            '<span style="font-size: 48pt"><i class="fas fa-play-circle"></i></span>';
        //text.style.borderBottomStyle = 'solid';
        //text.style.borderWidth = '2px';
        divCol.appendChild(text);
        //this.addReadEventListener(divContainer);
        const this_ = this;
        function f() {
            divCol.removeEventListener('click', f);
            this_.generateQuestionDOM();
            this_.startTime = new Date();
        }
        divCol.addEventListener('click', f);
    }
    import(data: any): void {
        for (const q of data['questions']) {
            const questionInstance = new SpeedReviewQuestion();
            this.questions.push(questionInstance);
            questionInstance.text = q['text'];
            questionInstance.correctIdx = q['correct-index'];
            for (const a of q['answers']) {
                questionInstance.answers.push(a);
            }
        }
    }
}
