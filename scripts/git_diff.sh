#!/bin/bash
echo "Program ’git_diff.sh’ starts now."

#echo “Absolute path to git directory, followed by [ENTER]: ”
#read directory_path
#cd directory_path
cd /Users/Lenka/Downloads/BcTryOuts/nativescript
echo $PWD

git pull
echo “Git pull DONE!”

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
i=0
declare -a output

while [ $i -lt 365 ]
do
    since=$(($i+10))' day ago'
    before=$i' day ago'
    output[$i]=$($(git diff $(git rev-list --since=“$since” --before=“$before” $branch)) | grep mflags -i | wc -l)
    i=$[$i+10]
done
 
export OUTPUT=${output[*]}
export NAME=${PWD##*/}