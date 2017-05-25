#!/bin/bash
#First argument is local address of the git repository
#Ssecond argument is the name of the committer
#Third argument is the pattern to search
#Forth argument is the time span that should be checked
if [ $# -eq 4 ]
then
    cd $1

    branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

    git pull origin $branch
    lastTimer=$(TZ=GMT+$4 date +%Y-%m-%d" "%H:%M:%S)

    output=$(git diff --committer="$2" "$branch@{$lastTimer}..$branch@{now}" | grep $3 -i | wc -l)
    echo $output
else
    echo "Arguments error"
fi 