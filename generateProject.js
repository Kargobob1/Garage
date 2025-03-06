// This script reads an Excel file, truncates all values to 20 characters,
// and outputs a new Excel file ready for import.

const fs = require('fs');
const XLSX = require('xlsx');

// Configuration
const inputFile = 'Zusammengefuehrte_Kennzeichenliste.xlsx';
const outputFile = 'Zusammengefuehrte_Kennzeichenliste_truncated.xlsx';
const maxLength = 20;

// Read the Excel file
console.log(`Reading file: ${inputFile}`);
const workbook = XLSX.readFile(inputFile, {
  cellStyles: true,
  cellFormulas: true,
  cellDates: true,
  cellNF: true,
  sheetStubs: true
});

// Process each sheet in the workbook
workbook.SheetNames.forEach(sheetName => {
  console.log(`Processing sheet: ${sheetName}`);
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to JSON for easier manipulation
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Keep track of how many cells were truncated
  let truncatedCount = 0;
  
  // Process each row and truncate values if needed
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      // Skip null or undefined values
      if (data[i][j] == null) continue;
      
      // Convert to string (important for handling numbers, dates, etc.)
      const value = String(data[i][j]);
      
      // Truncate if longer than maxLength
      if (value.length > maxLength) {
        data[i][j] = value.substring(0, maxLength);
        truncatedCount++;
        
        // Log the first few truncated values for verification
        if (truncatedCount <= 5) {
          console.log(`Truncated: "${value}" → "${data[i][j]}" (Row ${i+1}, Col ${j+1})`);
        }
      }
    }
  }
  
  // Create a new worksheet from the modified data
  const newWorksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Copy the cell formats and styles from the original worksheet
  if (worksheet['!cols']) newWorksheet['!cols'] = worksheet['!cols'];
  if (worksheet['!rows']) newWorksheet['!rows'] = worksheet['!rows'];
  if (worksheet['!merges']) newWorksheet['!merges'] = worksheet['!merges'];
  
  // Update the worksheet in the workbook
  workbook.Sheets[sheetName] = newWorksheet;
  
  console.log(`Total cells truncated in sheet "${sheetName}": ${truncatedCount}`);
});

// Write the modified workbook to a new file
XLSX.writeFile(workbook, outputFile);
console.log(`\nProcessing complete!`);
console.log(`Truncated file saved as: ${outputFile}`);
console.log(`All values have been limited to ${maxLength} characters.`);
console.log(`\nYou can now safely import this file into your database.`);