# Read it later
---
### Requirements 
In order to generate PDF files, [wkhtmltopdf](https://wkhtmltopdf.org/index.html) must be installed on the application host.

### Configuration

Add a `.env` file on the root level folder of the app.

```
SESS_SECRET=<A secret phrase used by cookie-parser and express-session>
DB_FOLDER=<A folder path for the sqlite3 database >
DB_FILE=<A file name for the sqlite3 database>
```

### Usage

**Run a production server** `$ npm start`

**Run a development server**  `$ npm run dev`
