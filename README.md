# PDF Student Ranking Reader

A web-based application that allows users to upload PDF files containing student ranking information and display the extracted data in an HTML table.

The application uses JavaScript and PDF.js to read PDF documents directly in the browser. No server-side processing is required.

## Features

- Upload PDF files using the browser's File API.
- Validate the selected file type and check whether the file is empty.
- Extract text from PDF documents using PDF.js.
- Automatically identify student records using regular expressions.
- Extract the following information:
  - Student number
  - Full name
  - Overall rating
  - Academic group
  - Additional information
- Display extracted records in an HTML table.
- Show the total number of extracted records.
- Display file information and reading status.
- Handle invalid files and reading errors.

## Technologies Used

- **HTML5** – application structure.
- **CSS3** – page styling and table layout.
- **JavaScript (ES6+)** – file handling, PDF processing, text parsing, and DOM manipulation.
- **PDF.js 3.11.174** – extracting text from PDF documents.

## Getting Started
### 3. Run the application

You can run the application in the following way: https://disvrr.github.io/PDF_reader/

### 4. Upload a PDF file

1. Open the application in your browser.
2. Click the file selection button.
3. Select a PDF document containing student ranking information.
4. Wait for the application to process the document.
5. View the extracted student records in the table.

## How It Works

1. The user selects a PDF file through an HTML file input.
2. JavaScript validates the selected file.
3. The File API reads the file using `file.arrayBuffer()`.
4. PDF.js loads the document and extracts text from each page.
5. The extracted text is grouped into lines based on PDF text coordinates.
6. Regular expressions identify student records and separate their fields.
7. JavaScript dynamically creates HTML table rows using DOM methods.
8. The application displays the extracted records and their total count.

## Requirements

- A modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, etc.).
- An internet connection to load the PDF.js library from the CDN.
- A PDF document containing selectable text.

**Note:** Scanned PDFs containing only images may not be processed correctly because the application does not include OCR (Optical Character Recognition).

## Error Handling

The application checks for:
- Missing file selection.
- Invalid file formats.
- Empty files.
- PDF loading and reading errors.
- Documents without recognizable student records.

## License

This project was created for educational purposes as part of a university assignment.
