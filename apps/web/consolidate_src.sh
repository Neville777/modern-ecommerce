#!/bin/bash

# Script to consolidate all files from src directory into a single text file
# Usage: ./consolidate_src.sh [output_file]

# Set output file name (default: src_consolidated.txt)
OUTPUT_FILE=${1:-"src_consolidated.txt"}

# Base directory
SRC_DIR="./src"

# Check if src directory exists
if [ ! -d "$SRC_DIR" ]; then
  echo "Error: $SRC_DIR directory not found!"
  exit 1
fi

# Create or overwrite the output file with a header
echo "# Source Code Consolidation - $(date)" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "PROJECT STRUCTURE" >> "$OUTPUT_FILE"
echo "================" >> "$OUTPUT_FILE"

# Add directory structure
find "$SRC_DIR" -type d -o -type f | sort | sed "s|^\.\/|/home/nevo/projects/modern-ecommerce/apps/web/|" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Add a section for file contents
echo "FILE CONTENTS" >> "$OUTPUT_FILE"
echo "============" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Process each file
find "$SRC_DIR" -type f | sort | while read -r file; do
  # Skip binary files like fonts, images, etc.
  if file "$file" | grep -q "binary"; then
    echo "FILE: ${file}" >> "$OUTPUT_FILE"
    echo "---------------------------------------------------" >> "$OUTPUT_FILE"
    echo "Binary or non-text file: ${file}" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    continue
  fi
  
  # For text files, include the content
  echo "FILE: ${file}" >> "$OUTPUT_FILE"
  echo "---------------------------------------------------" >> "$OUTPUT_FILE"
  cat "$file" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
done

echo "Consolidation complete! All files saved to $OUTPUT_FILE"
echo "Total size: $(du -h "$OUTPUT_FILE" | cut -f1)"