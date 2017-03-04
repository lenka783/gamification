#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
clear
echo "Program 'main.sh’ starts now."

echo "Executing 'git_diff.sh'"

chmod +x ./git_diff.sh
. git_diff.sh

echo "'git_diff.sh' DONE!"
cd $parent_path

mongo --eval "var name=\"$NAME\", output=\"$OUTPUT\"" mongoDB.js