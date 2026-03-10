//SERVER MODULE

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

function readData() {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

app.get('/hometext', (req, res) => {
    const data = readData();
    res.json({ homeText: data.homeText });
});

app.get('/abouttext', (req, res) => {
    const data = readData();
    res.json({ aboutText: data.aboutText });
});

app.get('/referencestext', (req, res) => {
    const data = readData();
    res.json({ referencesText: data.referencesText });
});

app.get('/timeline', (req, res) => {
    const data = readData();
    res.json(data.timeline);
});

app.get('/years', (req, res) => {
    const data = readData();
    const years = data.timeline.map(entry => ({
        id: entry.id,
        year: entry.year
    }));
    res.json(years);
});

app.get('/year/:year', (req, res) => {
    const data = readData();
    const year = req.params.year;
    const entries = data.timeline.filter(entry => entry.year === year);
    res.json(entries);
});

app.get('/technologies', (req, res) => {
    const data = readData();
    const allTech = data.timeline.flatMap(entry => entry.tech);
    const uniqueTech = [...new Set(allTech)];
    res.json(uniqueTech);
});

app.get('/technology/:tech', (req, res) => {
    const data = readData();
    const tech = req.params.tech;
    const entries = data.timeline.filter(entry => entry.tech.includes(tech));
    res.json(entries);
});

app.post('/timeline', (req, res) => {
    const newEntry = req.body;
    const data = readData();
    newEntry.id = data.timeline.length ? Math.max(...data.timeline.map(e => e.id)) + 1 : 1;
    data.timeline.push(newEntry);
    writeData(data);
    res.status(201).json(newEntry);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { app };
