/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

import { Part } from './part';

export class PartNewPage extends Part {
    generateDOM(): void {
        // empty
    }
    import(data: any): void {
        this.coursePage.incrementNumPages();
    }
}
