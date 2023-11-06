#!/bin/bash

# Directory containing the avatars
DIR="./public/avatars"

# Counter for the avatar name
count=1

# Change to the directory containing the avatars
cd $DIR

# Iterate over each image file in the directory
for file in *.{jpg,png}; do
    # Check if the file exists (to prevent issues with no matches)
    if [ -f "$file" ]; then
        # Extract the file extension
        extension="${file##*.}"
        
        # Rename the file
        mv "$file" "avatar$count.$extension"
        
        # Increment the counter
        ((count++))
    fi
done

# Return to the original directory
cd -

echo "Avatars renamed successfully!"
