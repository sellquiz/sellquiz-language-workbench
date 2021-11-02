#!/bin/bash

echo "Set access password (users are asked for this password at time of registration):"
read pwd

echo "# this file was generated by config.sh" > config.txt
echo "$pwd access_pwd" >> config.txt

echo "maxima:" >> config.txt
command -v maxima >> config.txt
echo "python3:" >> config.txt
command -v python3 >> config.txt
echo "javac:" >> config.txt
command -v javac >> config.txt
echo "java:" >> config.txt
command -v java >> config.txt
echo "pdflatex:" >> config.txt
command -v pdflatex >> config.txt
echo "gnuplot:" >> config.txt
command -v gnuplot >> config.txt
echo "pdf2svg:" >> config.txt
command -v pdf2svg >> config.txt

echo "!!!!! check, if all paths in file 'config.txt' are set."
echo "If not: install dependency and run './config.sh' again !!!!!"
