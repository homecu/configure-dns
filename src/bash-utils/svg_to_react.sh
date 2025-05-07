#!/bin/bash

# Go to the folder containing the SVG files
cd /Users/jgimitola-mac/Downloads/TerminalRename

# Create the 'out' folder if it doesn't exist
mkdir -p out

# Loop through each .svg file in the directory
for file in *.svg; do
  # Get the base name (without extension)
  base_name=$(basename "$file" .svg)  

  # Create the React component file in the 'out' folder with .tsx extension
  output_file="out/${base_name}.tsx"

  # Begin writing the React component to the output file
  echo "import React from 'react';
import { createAdaptedSVGProps } from '../utils/createAdaptedSVGProps';
import { IconProps } from '../types';

const ${base_name} = (props: IconProps) => (
  <svg" > "$output_file"

  # Extract relevant attributes (viewBox, fill, xmlns) from the top-level <svg> tag
  svg_tag=$(grep -oE '<svg[^>]*>' "$file")
  viewBox=$(echo "$svg_tag" | grep -oE 'viewBox="[^"]+"')
  fill=$(echo "$svg_tag" | grep -oE 'fill="[^"]+"')
  xmlns=$(echo "$svg_tag" | grep -oE 'xmlns="[^"]+"')

  # Append the attributes to the svg tag in the output file
  echo " $viewBox $fill $xmlns {...createAdaptedSVGProps(props)}>" >> "$output_file"

  # Add the inner content of the SVG file (but remove the original <svg> and </svg> tags)
  # Replace inner fill values with currentColor
  sed -e 's/stroke-width/strokeWidth/g' \
      -e 's/fill-rule/fillRule/g' \
      -e 's/clip-rule/clipRule/g' \
      -e 's/stroke-linecap/strokeLinecap/g' \
      -e 's/stroke-linejoin/strokeLinejoin/g' \
      -e 's/stroke-miterlimit/strokeMiterlimit/g' \
      -e 's/color-interpolation-filters/colorInterpolationFilters/g' \
      -e 's/class=/className=/g' \
      -e 's/fill="[^"]*"/fill="currentColor"/g' \
      -e '1d;$d' "$file" >> "$output_file"

  # Close the SVG tag and React component
  echo "</svg>
);

export default ${base_name};" >> "$output_file"

  echo "Created React component: ${output_file}"
done
