#!/bin/bash
clear
echo "Program 'main.sh’ starts now."

echo "Executing 'git_diff.sh'"

chmod +x ./git_diff.sh
. git_diff.sh

echo "'git_diff.sh' DONE!"
cd ~/Documents/BachelorThesis/BcThesis/scripts

mongo --eval "var name=\"$NAME\", output=\"$OUTPUT\"" mongoDB.js