# Internet History of Denmark — Tech Timeline

Web project presenting an interactive timeline of Danish internet history, backed by a Node.js/Express REST API.


## Project Structure

WebDev_TechnicalProject/
├── server/
│   ├── server.js      # Express REST API server
│   ├── data.json      # JSON data (timeline entries, page text)
│   └── package.json
└── web_page/
    ├── index.html     # Home page
    ├── history.html   # Timeline page
    ├── about.html     # About & contact page
    ├── script.js      # Client-side JavaScript
    └── styles.css     # Stylesheet
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)


## Running the Server

The API server must be running for the web pages to fetch their content.

### 1. Install dependencies

- CLI
cd to /server
npm install


### 2. Start the server

- CLI
node server.js


The server will start on **http://localhost:3000** and you should see:

Server is running on http://localhost:3000

Keep this terminal open while using the site.


## Viewing the Web Pages

### Option A — Go Live (VS Code extension)

The "Live Server" extension by [Ritwick Dey](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) lets you open the site directly in your browser with one click and automatically reloads on file changes.

1. Install the **Live Server** extension in VS Code (extension ID: `ritwickdey.LiveServer`).
2. Open any `.html` file inside `web_page/` in the editor.
3. Click **Go Live** in the VS Code status bar (bottom-right), or right-click the file and choose **Open with Live Server**.
4. Your browser will open the page, typically at `http://127.0.0.1:5500`.

- Note: Make sure the Express server (`node server.js`) is already running before opening the pages, so that the API calls succeed.

### Option B — Open the files directly

Simply open `web_page/index.html` (or any other `.html` file) in your browser. Again, the Express server must be running first.


## API Endpoints

All endpoints are served from `http://localhost:3000`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hometext` | Home page body text 
| GET | `/abouttext` | About page body text 
| GET | `/referencestext` | References page text 
| GET | `/timeline` | Full timeline (all entries) 
| GET | `/years` | List of years (id + year) 
| GET | `/year/:year` | Timeline entries for a specific year 
| GET | `/technologies` | Unique list of all technologies 
| GET | `/technology/:tech` | Timeline entries for a specific technology 
| POST | `/timeline` | Add a new timeline entry 
