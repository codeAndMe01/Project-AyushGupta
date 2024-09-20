const express = require('express');
const app = express();
const path = require('path');

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


app.get('/admin',(req,res)=>{
    res.render('admin/layout',{page : 'dashboard'})
})



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
