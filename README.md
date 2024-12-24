# PDF Merger Application

A simple PDF merger application that allows users to upload two PDF files, select specific pages to merge, and download the merged result.

## Features

- Merge two PDF files.
- Optional: Choose specific pages to merge (e.g., 1-3, 5, etc.).
- Dynamic and responsive user interface.
- Temporary deletion of merged PDF files after 10 minutes.

## Tech Stack

- **Backend**: Node.js, Express.js
- **PDF manipulation**: pdf-lib
- **File handling**: Multer (for handling file uploads)
- **Cron Jobs**: node-cron (for scheduling automatic deletion of merged PDFs)
- **CSS Framework**: Tailwind CSS
- **Frontend**: HTML, CSS (using Tailwind for styling)

## Installation

### Prerequisites

Ensure you have Node.js and npm installed.

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Raunak22-Dev/PDF-Merger-Application.git
    cd pdf-merger
    ```

### Running the App

1. After setting up the dependencies and Tailwind, start the application:
   ```bash
   npm run both
