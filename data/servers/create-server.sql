/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 *                                                                            *
 * Partly funded by: Digitale Hochschule NRW                                  *
 * https://www.dh.nrw/kooperationen/hm4mint.nrw-31                            *
 *                                                                            *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 *                                                                            *
 * This library is licensed as described in LICENSE, which you should have    *
 * received as part of this distribution.                                     *
 *                                                                            *
 * This software is distributed on "AS IS" basis, WITHOUT WARRENTY OF ANY     *
 * KIND, either impressed or implied.                                         *
 ******************************************************************************/

-- This file creates a "Server", i.e. a database for testing, hosting, ...

-- all values are stored as INTEGER. Precision is given by suffix.
-- E.g. "value100" means  value := value100 / 100.0

CREATE TABLE Course (
    id INTEGER NOT NULL, -- same ID as in database.db
    courseName TEXT NOT NULL,
    UNIQUE(id)
);

CREATE TABLE Document (
    id INTEGER NOT NULL, -- same ID as in database.db
    documentName TEXT NOT NULL,
    documentText TEXT,
    documentCompiled TEXT,
    courseId INTEGER NOT NULL,
    UNIQUE(id),
    FOREIGN KEY(courseId) REFERENCES Course(id)
);

CREATE TABLE Student (
    id INTEGER NOT NULL, -- matriculation number
    accessToken TEXT,
    UNIQUE(id)
);

-- TODO: remove test student
INSERT INTO Student
    (id, accessToken)
    VALUES
    (1337314, 'abcdefg-123456');

CREATE TABLE StudentData (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documentId INTEGER NOT NULL,
    studentId INTEGER NOT NULL,
    studentDataAnswerId TEXT,

    studentDataInput TEXT, -- divided by # in case of multiple fields
    studentDataRandomNumbers TEXT, -- divided by # in case of multiple numbers
    studentDataScore100 NUMBER, -- score := studentDataScore100 / 100.0

    studentDataDate INTEGER NOT NULL,  -- UNIX time
    FOREIGN KEY(documentId) REFERENCES Document(id),
    FOREIGN KEY(studentId) REFERENCES Student(id)
);
