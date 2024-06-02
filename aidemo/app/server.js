const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS with preflight options
app.use(cors());
app.options('*', cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Sample API key for demonstration purposes
const apiKey = 'YOUR_API_KEY';

// Middleware to set the API key for API routes only
app.use('/api', (req, res, next) => {
    if (req.headers['x-mini-dashboard-api-key'] !== apiKey) {
        return res.status(403).send('Forbidden');
    }
    next();
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let organizations = [
    {
        id: '2930418',
        name: 'My organization',
        url: 'https://dashboard.mini.com/o/VjjsAd/manage/organization/overview',
        api: { enabled: true },
        licensing: { model: 'co-term' },
        cloud: { region: { name: 'North America' } }
    }
];

// List organizations
app.get('/api/v1/organizations', (req, res) => {
    res.json(organizations);
});

// Create a new organization
app.post('/api/v1/organizations', (req, res) => {
    const { name } = req.body;
    const newOrg = {
        id: (organizations.length + 1).toString(),
        name,
        url: `https://dashboard.mini.com/o/${Math.random().toString(36).substr(2, 9)}/manage/organization/overview`,
        api: { enabled: true },
        licensing: { model: 'co-term' },
        cloud: { region: { name: 'North America' } }
    };
    organizations.push(newOrg);
    res.status(201).json(newOrg);
});

// Get details of a specific organization
app.get('/api/v1/organizations/:organizationId', (req, res) => {
    const organization = organizations.find(org => org.id === req.params.organizationId);
    if (organization) {
        res.json(organization);
    } else {
        res.status(404).send('Organization not found');
    }
});

// Delete an organization
app.delete('/api/v1/organizations/:organizationId', (req, res) => {
    const orgIndex = organizations.findIndex(org => org.id === req.params.organizationId);
    if (orgIndex !== -1) {
        organizations.splice(orgIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Organization not found');
    }
});

app.listen(port, () => {
    console.log(`MiniDashboard API server running at http://localhost:${port}`);
});
