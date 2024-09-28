const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');



//mogoose connection
const bodyParser = require('body-parser');
const connectDB = require('./db');
const router = require('./routes/fiveRsNamkeen');


// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB();


// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));


// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'uploads')));


// Function to read JSON files
const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error(`Error reading ${filePath}: ${err.message}`);
    }
};



// Define routes
app.get('/', async (req, res) => {
    try {
        const namkeenFilePath = path.join(__dirname, 'public', 'data', 'fiveRsNamkeen.json');
        const fiveRsPuffsPath = path.join(__dirname, 'public', 'data', 'fiveRsPuffs.json');

        // Read both JSON files concurrently
        const [namkeenData, fiveRsPuffsData] = await Promise.all([
            readJsonFile(namkeenFilePath),
            readJsonFile(fiveRsPuffsPath)
        ]);

        // Render the index page with the title and both JSON data sets
        res.render('index', {
            title: 'Home',
            namkeenData,
            fiveRsPuffsData
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/about', (req, res) => {
    res.render('index', { title: 'About' });
});

app.get('/contact', (req, res) => {
    res.render('index', { title: 'Contact' });
});

// Admin routes 

app.get('/admin',(req,res)=>{
    res.render('admin/layout',{page : 'dashboard'})
})

app.get('/admin/fiveRs-Namkeen',(req,res)=>{
    res.render('admin/layout',{page: 'fiveRsNamkeen'})
})


app.use(router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
