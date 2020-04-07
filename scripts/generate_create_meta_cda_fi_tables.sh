#!/usr/bin/env bash

FILE_PATH="$HOME/Downloads/meta_cda_fi_txt/"
QUERY_FILE="/tmp/query.txt"
rm $QUERY_FILE
touch $QUERY_FILE
for FILE_NAME in $(eval "ls $FILE_PATH"); do
    python3 generate_create_table.py $FILE_PATH$FILE_NAME $(echo $FILE_NAME | sed s/meta_//g | sed s/\.txt//g | tr a-z A-Z) >> $QUERY_FILE
    echo "" >> $QUERY_FILE
done

cat $QUERY_FILE | pbcopy
cat $QUERY_FILE
