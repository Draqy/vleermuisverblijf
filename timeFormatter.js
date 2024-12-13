const fs = require('fs');
const path = require('path');

// Helper function to convert date-time format
function convertDateTime(dateTime) {
  const regex = /^([0-9]{2})-([0-9]{2})-([0-9]{4})\s*-\s*([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
  const match = dateTime.match(regex);
  if (match) {
    // Convert to InfluxDB time format (YYYY-MM-DDTHH:MM:SSZ)
    return `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:${match[6]}Z`;
  }

  // If the date format is not recognized, print a warning and return the original value
  console.warn(`Date format not recognized: ${dateTime}`);
  return dateTime; // Return the original value if no match is found
}























// Function to process CSV and change date format
function processCsv() {
  const inputFilePath = path.join(__dirname, 'input.csv');
  const outputFilePath = path.join(__dirname, 'output.csv');

  // Read the input file
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading input file: ${err}`);
      return;
    }

    // Split the file into lines and process each line
    const lines = data.split('\n').filter(line => line.trim() !== ''); // Remove empty lines
    if (lines.length < 2) {
      console.error('Error: File does not contain enough data.');
      return;
    }

    // Try to detect if the first line contains headers
    const headers = lines[0].split('\t');
    const firstLineIsData = !headers[0].match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})\s*-\s*([0-9]{2}):([0-9]{2}):([0-9]{2})$/); // Check if first column matches date format

    // InfluxDB annotations for files without headers
    const outputLines = [];
    if (firstLineIsData) {
      console.log("No header detected, treating the first row as data.");

      // InfluxDB annotations for files without headers
      outputLines.push('#group,false,false,false,false,false,false,false,false');
      outputLines.push('#datatype,dateTime,string,double,double,double,long,long,long');
      outputLines.push('#default ,,,,,,,,');
      outputLines.push('_time,_measurement,temp1,rh,battery,messages,sw,gw');
      outputLines.push(''); // Add a newline to separate the headers from data
    } else {
      console.log("Header detected, using the first row as headers.");

      // InfluxDB annotations for files with headers
      outputLines.push('#group,false,false,false,false,false,false,false,false');
      outputLines.push('#datatype,dateTime,string,string,double,double,long,long,long,long');
      outputLines.push('#default ,,,,,,,,');
      outputLines.push('_time,_measurement,description,temperature,rh,battery,messages,sw,gw');
    }

    // Process each line
    for (let i = (firstLineIsData ? 0 : 1); i < lines.length; i++) {
      const row = lines[i].split('\t'); // Split by tab
      console.log("Original row:", row); // Log original row for debugging

      // Transform the date column if it's the correct one
      const transformedRow = row.map((value, index) => {
        if (index === 0) {
          const newValue = convertDateTime(value); // Transform the date column
          console.log(`Transformed date value: ${value} -> ${newValue}`); // Log the date transformation
          return newValue;
        }
        return value; // Keep other columns unchanged
      });

      // For files without a header, treat the first column after the date as the sensor (_measurement)
      if (firstLineIsData) {
        const sensor = transformedRow[1]; // This should be the sensor name (e.g., "MSSL-LA66N710706")
        transformedRow[1] = `"${sensor}"`; // Ensure it's quoted properly for the _measurement field
        // Map subsequent columns as temp1, temp2, etc.
        for (let j = 2; j < transformedRow.length; j++) {
          transformedRow[j] = `temp${j - 1}`; // Map columns to temp1, temp2, etc.
        }
      }

      // Log transformed row for debugging
      console.log("Transformed row:", transformedRow);

      // Add the transformed row to the output
      outputLines.push(transformedRow.join(','));
    }

    // Write the output file
    fs.writeFile(outputFilePath, outputLines.join('\n'), 'utf8', err => {
      if (err) {
        console.error(`Error writing output file: ${err}`);
        return;
      }
      console.log(`File successfully written to ${outputFilePath}`);
    });
  });
}

// Run the processing function
processCsv();
