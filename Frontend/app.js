const express = require('express');
const app = express();
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

// Define routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
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
