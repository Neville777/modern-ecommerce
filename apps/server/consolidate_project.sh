#!/bin/bash

# Set the project root directory
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Output file for consolidated text
OUTPUT_FILE="${PROJECT_ROOT}/project_consolidated.txt"

# Function to add file header
add_file_header() {
    local filepath="$1"
    echo "" >> "$OUTPUT_FILE"
    echo "FILE: $filepath" >> "$OUTPUT_FILE"
    echo "---------------------------------------------------" >> "$OUTPUT_FILE"
}

# Clear previous output file
> "$OUTPUT_FILE"

# Write project structure overview
echo "PROJECT STRUCTURE" >> "$OUTPUT_FILE"
echo "================" >> "$OUTPUT_FILE"
tree "$PROJECT_ROOT" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "FILE CONTENTS" >> "$OUTPUT_FILE"
echo "============" >> "$OUTPUT_FILE"

# Find and process all files
find "$PROJECT_ROOT" -type f \( -name "*.ts" -o -name "*.json" -o -name "*.yml" -o -name "*.md" \) | while read -r file; do
    # Skip node_modules and dist directories
    if [[ "$file" == *"/node_modules/"* ]] || [[ "$file" == *"/dist/"* ]]; then
        continue
    fi
    
    # Add file header
    add_file_header "$file"
    
    # Try to add file contents
    if file "$file" | grep -q "text"; then
        cat "$file" >> "$OUTPUT_FILE"
    else
        echo "Binary or non-text file: $file" >> "$OUTPUT_FILE"
    fi
done

echo "Consolidation complete. Output file: $OUTPUT_FILE"