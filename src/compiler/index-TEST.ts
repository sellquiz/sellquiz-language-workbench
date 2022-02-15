/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 ******************************************************************************/

// ATTENTION: delete output JSON file for full compilation
//   otherwise only an incremental update of changed source is compiled.

process.argv[2] = 'src/compiler/test-data/compiler-test-1.txt';
process.argv[3] = 'src/compiler/test-data/compiler-test-1.json';

import './index';
