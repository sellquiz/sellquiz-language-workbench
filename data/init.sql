/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2021 TH Köln                                            *
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

-- all values are stored as INTEGER. Precision is given by suffix.
-- E.g. "value100" means  value := value100 / 100.0

CREATE TABLE Course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseName TEXT NOT NULL,
    courseDesc TEXT,
    courseDateCreated INTEGER NOT NULL,  -- UNIX time
    courseDateModified INTEGER NOT NULL  -- UNIX time
);

CREATE TABLE Document (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documentName TEXT NOT NULL,
    documentDesc TEXT,
    documentText TEXT,
    courseDateCreated INTEGER NOT NULL,  -- UNIX time
    courseDateModified INTEGER NOT NULL  -- UNIX time
);

CREATE TABLE DocumentBackup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documentId INTEGER NOT NULL,
    documentBackupText TEXT,
    documentBackupCreated INTEGER NOT NULL, -- UNIX time
    FOREIGN KEY(documentId) REFERENCES Document(id)
)

CREATE TABLE UserRole (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roleName TEXT NOT NULL
);

CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userRoleId INTEGER NOT NULL,
    userName TEXT NOT NULL,
    userMail TEXT NOT NULL,
    userInstitute TEXT,
    userDateCreated INTEGER NOT NULL,  -- UNIX time
    userDateModified INTEGER NOT NULL,  -- UNIX time
    FOREIGN KEY(userRoleId) REFERENCES UserRole(id)
);

CREATE TABLE Ticket (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticketName TEXT NOT NULL,
    ticketDateCreated INTEGER NOT NULL,  -- UNIX time
    ticketDateModified INTEGER NOT NULL  -- UNIX time
);

CREATE TABLE TicketEntry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticketId INTEGER NOT NULL,
    ticketEntryUserId INTEGER NOT NULL,
    ticketEntryText TEXT NOT NULL,
    ticketEntryDateCreated INTEGER NOT NULL,  -- UNIX time
    ticketEntryDateModified INTEGER NOT NULL,  -- UNIX time
    FOREIGN KEY(ticketId) REFERENCES Ticket(id),
    FOREIGN KEY(ticketEntryUserId) REFERENCES User(id)
);
