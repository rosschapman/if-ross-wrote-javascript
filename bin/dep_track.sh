#! /bin/bash

# CONSTS
FILE_NAME="README.md"
UI_DELAY=1

# ROUTINE
echo "Retrieving dependency list and calculating length..." 
DEP_LEN=$(npm ls --json --dev --depth=0 | jq length)
echo "Looks like we got ${DEP_LEN}"
sleep $UI_DELAY
echo "Checking if it's changed since last time..."
if grep -Fq "devDependencies is ${DEP_LEN}" $FILE_NAME
then
  sleep $UI_DELAY
  echo "Nothing's changed, goodbye!!"
  exit
else
  sleep $UI_DELAY
  # TODO: add # of diff, ie "meh, looks like we added n more" or "yay, we 
  # actually removed some!"
  echo "Yep, looks we like added some."
  sleep $UI_DELAY
  echo "Writing the new value to ${FILE_NAME}..." 
  sleep $UI_DELAY
  sed -i "s|devDependencies is [0-9]|devDependencies is ${DEP_LEN}|g" $FILE_NAME
  echo "All done!!"
fi
