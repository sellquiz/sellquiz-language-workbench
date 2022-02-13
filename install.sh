#!/bin/bash
if ! command -v npm &> /dev/null
then
    echo "failed to install: depencency 'npm' is missing"
    exit
fi
if ! command -v php &> /dev/null
then
    echo "failed to install: depencency 'php' is missing"
    exit
fi

# install dependencies
npm install

# compress dictionaries
node_modules/lz-string/bin/bin.js node_modules/dictionary-en/index.dic > cache/dict-en-compr.dic
node_modules/lz-string/bin/bin.js node_modules/dictionary-de/index.dic > cache/dict-de-compr.dic
node_modules/lz-string/bin/bin.js node_modules/dictionary-en/index.aff > cache/dict-en-compr.aff
node_modules/lz-string/bin/bin.js node_modules/dictionary-de/index.aff > cache/dict-de-compr.aff

# configurate
cd data
./init.sh
cd ..
