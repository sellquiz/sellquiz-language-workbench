#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "usage: create-server.sh SERVERNAME"
    exit -1
fi
sqlite3 $1.db < create-server.sql
