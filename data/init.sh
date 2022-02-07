#!/bin/bash
dbfile=./database.db
if [ -e $dbfile ]; then
    read -p "WARNING: Overwrite existing database? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        rm database.db
        sqlite3 database.db < init.sql
        php init.php
    fi
else
    sqlite3 database.db < init.sql
    php init.php
fi
