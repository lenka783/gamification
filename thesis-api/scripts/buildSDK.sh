#!/bin/bash
echo "buildSDK.sh loaded"
sdkDirectory="../thesis-app/app/shared/sdk"

if [ -d $sdkDirectory ] 
then 
    echo "Do you wish to run Loopback SDK builder?"
    echo "Targeted directory $sdkDirectory will be erased!"
    echo "Press: 1. If you you made any changes in loopback application"
    echo "       2. If you didn't make any changes in loopback application"
    read answer
    if [ $answer = "1" ]
    then
        echo "Targeted directory $sdkDirectory will be erased and updated!"
        rm -r $sdkDirectory
        ./node_modules/.bin/lb-sdk server/server.js $sdkDirectory -d nativescript2 -i enabled
    else
        echo "No changes in $sdkDirectory!"
    fi
else
    ./node_modules/.bin/lb-sdk server/server.js $sdkDirectory -d nativescript2 -i enabled
fi

echo "buildSDK.sh finnished"
