#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "usage: create-server.sh SERVERNAME"
    exit -1
fi
dbfile=$1.db
if [ -e $dbfile ]; then
    read -p "WARNING: Overwrite existing database? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        rm $1.db
        sqlite3 $1.db < create-server.sql
    fi
else
    sqlite3 $1.db < create-server.sql
fi
