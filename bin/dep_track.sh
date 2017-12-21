#! /bin/bash

# vars
FILE_NAME="README.md"
UI_DELAY=.5

# Get list of 
echo "Retrieving dependency list and calculating length..." 
dep_len=$(npm ls --json --dev --depth=0 | jq length)
echo "Looks like we got ${dep_len}"
UI_sleep DELAY
echo "Checking if it's changed since last time..."
if grep -Fq "devDependencies is ${dep_len}" $FILE_NAME
then
  echo "Nothing's changed, goodbye!!"
  exit
else
  echo "Writing to ${FILE_NAME}..." 
  UI_sleep DELAY
  sed -i "" "s|devDependencies is [0-9]|devDependencies is ${dep_len}|g" $FILE_NAME
  echo "All done!!"
fi
