#!/bin/bash

# Websites to test
urls=(
    "https://dev.va.gov/detroit-health-care/events/70531"

    # Add more website addresses here
)

# Where to save the reports
outputDir="./"

# Create the output directory if it doesn't exist
mkdir -p "$outputDir"

# Specify Node.js version
# NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use 20.3.1

# Get the total count of URLs
totalUrls=${#urls[@]}

# Initialize the count of generated files
generatedFiles=0

# Loop through each URL and run Lighthouse test
for url in "${urls[@]}"
do
   outputPath="$outputDir/$(date +%Y-%m-%d-%H-%M-%S).html"  # Create a unique output path for each test
   echo "Running Lighthouse test for URL: $url"
   echo "Output Path: $outputPath"
   npx lighthouse "$url" --output html --output-path "$outputPath" --only-categories performance
   ((generatedFiles++))
done

echo "Total URLs tested: $totalUrls"
echo "Total report files generated: $generatedFiles"