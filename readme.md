# CSV to JSON Filter

A Node.js application that processes CSV files and converts them to JSON format with filtering capabilities, featuring a terminal-based user interface with a progress bar to monitor the conversion process.

## 💭 Motivation

This project was created to solve the challenge of processing large CSV files efficiently while converting them to JSON format. It's particularly useful when you need to:

- Handle large datasets without memory constraints
- Filter specific columns from CSV files
- Monitor the conversion progress in real-time
- Process data in a memory-efficient way

## 🎯 Benefits

- **High Performance**: Successfully tested with CSV files containing over 1 million rows without Node.js memory issues
- **Memory Efficient**: Uses streams to process data in chunks rather than loading entire files into memory
- **Real-time Progress**: Visual feedback through a progress bar in the terminal
- **Configurable**: Easily customize which columns to extract from CSV files

## 📊 Stream Processing

The application leverages Node.js streams for several key advantages:

- **Memory Efficiency**: Processes data in small chunks instead of loading entire files
- **Backpressure Handling**: Automatically manages data flow to prevent memory overflow
- **Pipeline Processing**: Enables efficient data transformation without intermediate storage
- **Large File Support**: Can handle files larger than available system memory

## 🚀 Technologies

- Node.js 22+
- Dependencies:
  - `blessed` - Terminal interface library
  - `blessed-contrib` - Additional UI components
  - `csvtojson` - CSV parsing and conversion
  - `stream-concat` - Stream concatenation utility

## 📁 Project Structure

```
csv-to-json-filter/
├── src/
│   ├── controller.js
│   ├── index.js
│   ├── process-csv.js
│   └── view.js
├── uploads/
│   └── example.csv
└── package.json
```

## 🚀 How to Run

1. Clone the repository

```bash
git clone https://github.com/yourusername/csv-to-json-filter.git
cd csv-to-json-filter
```

2. Install dependencies:

```bash
npm install
```

3. Place your CSV files in the `uploads` directory

4. Run the application:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 💡 Usage

By default, the application filters the following CSV columns:

```javascript
const csvKeys = ["Respondent", "Professional"];
```

You can modify these keys in `src/index.js` to filter different columns.

The terminal interface displays a progress bar showing the conversion progress:

```
┌──────────────Progress──────────────┐
│██████████████████████████  75%     │
└────────────────────────────────────┘
```

To exit the application press:

- `q`
- `Esc`
- `Ctrl+C`

## ⚡ Requirements

- Node.js version 22 or higher
- CSV files must be placed in `uploads` directory
- CSV files should have headers matching the filter keys

The application processes CSV files using streams for efficient memory usage and displays real-time progress of the conversion process.
