#!/bin/bash

IGNORE_DIRS=()

while getopts ":i:" opt; do
    case $opt in
        i) IGNORE_DIRS+=("$OPTARG");;
        *) echo "Invalid option: -$OPTARG" >&2; exit 1;;
    esac
done

shift $((OPTIND -1))

is_ignored() {
    local dir=$1
    for ignore_dir in "${IGNORE_DIRS[@]}"; do
        if [ "$dir" == "$ignore_dir" ]; then
            return 0
        fi
    done
    return 1
}

print_tree() {
    local indent="${2:-0}"
    for file in "$1"/*; do
        if is_ignored "$(basename "$file")"; then
            continue
        fi

        for ((i=0; i<$indent; i++)); do
            echo -n "|   "
        done
        if [ -d "$file" ]; then
            basename "$file"
            print_tree "$file" $((indent + 1))
        else
            echo "|-- $(basename "$file")"
        fi
    done
}

if [ -d "$1" ]; then
    echo "$1"
    print_tree "$1"
else
    echo "Please provide a valid directory"
fi
