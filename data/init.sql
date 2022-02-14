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

-- all values are stored as INTEGER. Precision is given by suffix.
-- E.g. "value100" means  value := value100 / 100.0

CREATE TABLE Settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    settingsDatabaseVersion INTEGER,
    settingsTitle TEXT
);

INSERT INTO Settings
    (settingsDatabaseVersion, settingsTitle)
    VALUES
    (1, 'Demo');

CREATE TABLE Server (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serverName TEXT NOT NULL
);

INSERT INTO Server
    (serverName)
    VALUES
    ('test');

INSERT INTO Server
    (serverName)
    VALUES
    ('production');

CREATE TABLE Course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseName TEXT NOT NULL,
    courseDesc TEXT,
    courseDateCreated INTEGER NOT NULL,  -- UNIX time
    courseDateModified INTEGER NOT NULL  -- UNIX time
);

INSERT INTO Course
    (courseName, courseDesc, courseDateCreated, courseDateModified)
    VALUES
    ('demo', 'demo course', 1640991600, 1640991600);

CREATE TABLE Document (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documentName TEXT NOT NULL,
    documentDesc TEXT,
    documentText TEXT,
    documentCache TEXT, -- TODO: rename to documentCompiled
    courseId INTEGER NOT NULL,
    documentDateCreated INTEGER NOT NULL,  -- UNIX time
    documentDateModified INTEGER NOT NULL,  -- UNIX time
    FOREIGN KEY(courseId) REFERENCES Course(id)
);

INSERT INTO Document
    (documentName, documentDesc, documentText, documentCache,
     courseId,
     documentDateCreated, documentDateModified)
    VALUES
    ('its', 'demo document', '', '',
     (SELECT id FROM Course WHERE courseName='demo'),
     1640991600, 1640991600);

INSERT INTO Document
    (documentName, documentDesc, documentText, documentCache,
     courseId,
     documentDateCreated, documentDateModified)
    VALUES
    ('demo', 'demo document', '', '',
     (SELECT id FROM Course WHERE courseName='demo'),
     1640991600, 1640991600);

CREATE TABLE DocumentBackup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documentId INTEGER NOT NULL,
    documentBackupText TEXT,
    documentBackupCreated INTEGER NOT NULL, -- UNIX time
    FOREIGN KEY(documentId) REFERENCES Document(id)
);

-- CREATE TABLE Cache (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     documentId INTEGER NOT NULL,
--     cacheData TEXT,
--     FOREIGN KEY(documentId) REFERENCES Document(id)
-- );

CREATE TABLE UserRole (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userroleName TEXT NOT NULL,
    userroleAllowUserManagement INTEGER,
    userroleAllowAccessToAllCourses INTEGER
);

INSERT INTO UserRole
    (userroleName, userroleAllowUserManagement, userroleAllowAccessToAllCourses)
    VALUES
    ('admin', 1, 1);

INSERT INTO UserRole
    (userroleName, userroleAllowUserManagement, userroleAllowAccessToAllCourses)
    VALUES
    ('demo', 0, 0);

CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userRoleId INTEGER NOT NULL,
    userLogin TEXT NOT NULL,
    userPasswordHash TEXT NOT NULL,
    userName TEXT NOT NULL,
    userMail TEXT NOT NULL,
    userInstitute TEXT,
    userDateCreated INTEGER NOT NULL,  -- UNIX time
    userDateModified INTEGER NOT NULL,  -- UNIX time
    FOREIGN KEY(userRoleId) REFERENCES UserRole(id)
);

-- initial admin password is 'admin':
--   $php -r 'echo password_hash("admin", PASSWORD_BCRYPT);'
INSERT INTO User
    (userRoleId, userLogin,
     userPasswordHash,
     userName, userMail, userInstitute, userDateCreated, userDateModified)
    VALUES
    ((SELECT id FROM UserRole WHERE userroleName='admin'), 'admin',
     '$2y$10$tWDoRJQ8e8aSn5ObV0dNO.wjWwO3X/bhqDMpJiq.n7g/LMEdsj/5m',
     'admin', 'admin@localhost', '', 1640991600, 1640991600);

INSERT INTO User
    (userRoleId, userLogin,
     userPasswordHash,
     userName, userMail, userInstitute, userDateCreated, userDateModified)
    VALUES
    ((SELECT id FROM UserRole WHERE userroleName='demo'), 'demo',
     '',
     'demo', 'demo@localhost', '', 1640991600, 1640991600);

CREATE TABLE CourseAccess (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    FOREIGN KEY(courseId) REFERENCES Course(id),
    FOREIGN KEY(userId) REFERENCES User(id)
);

INSERT INTO CourseAccess
    (courseId,
     userId)
    VALUES
    ((SELECT id FROM Course WHERE courseName='demo'),
     (SELECT id FROM User WHERE userLogin='demo'));

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
