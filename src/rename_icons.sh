#!/bin/bash

cd /Users/jgimitola-mac/Downloads/TerminalRename

# Loop over the files with "Icons_" in the name
for file in Icons_*; do
  # Extract the filename without extension
  filename=$(basename "$file" | sed 's/\.[^.]*$//')
  
  # Extract the extension
  extension="${file##*.}"
  
  # Remove the "Icons_" prefix
  name=$(echo "$filename" | sed 's/^Icons_//')

  # Check if the file name contains "Filled"
  if [[ $name == Filled_* ]]; then
    # Remove "Filled_", convert to TitleCase, and append "Filled" before the extension
    new_name=$(echo "$name" | sed 's/^Filled_//' | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | sed 's/ //g')
    mv "$file" "${new_name}Filled.$extension"
  else
    # Convert to TitleCase and remove underscores, spaces
    new_name=$(echo "$name" | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' | sed 's/ //g')
    mv "$file" "$new_name.$extension"
  fi
done

