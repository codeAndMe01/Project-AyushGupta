const express = require('express')
const router = express.Router();
const multer = require('multer');
const fiveRsNamkeen = require('../models/fiveRsNamkeen');

// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');  // Image storage folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // Save with unique name
    }
});


const upload = multer({ storage: storage });


router.get('/addFiveRsNamkeen',(req,res)=>{
    res.render('admin/addFiveRsNamkeen')
})

// CREATE: Add new fiveRsNamkeen
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;
        const image = req.file.filename;

        const newfiveRsNamkeen = new fiveRsNamkeen({
            name,
            image,
            price
        });

        await newfiveRsNamkeen.save();
        res.status(201).json({ message: 'fiveRsNamkeen added successfully!', fiveRsNamkeen: newfiveRsNamkeen });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add fiveRsNamkeen', error });
    }
});

// READ: Get all fiveRsNamkeen products
router.get('/', async (req, res) => {
    try {
        const fiveRsNamkeenList = await fiveRsNamkeen.find();
        res.status(200).json(fiveRsNamkeenList);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch fiveRsNamkeen', error });
    }
});

// UPDATE: Update a fiveRsNamkeen product by ID
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;
        const updateData = { name, price };

        if (req.file) {
            updateData.image = req.file.filename;  // If new image is uploaded
        }

        const updatedfiveRsNamkeen = await fiveRsNamkeen.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: 'fiveRsNamkeen updated successfully!', fiveRsNamkeen: updatedfiveRsNamkeen });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update fiveRsNamkeen', error });
    }
});

// DELETE: Remove a fiveRsNamkeen product by ID
router.delete('/:id', async (req, res) => {
    try {
        await fiveRsNamkeen.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'fiveRsNamkeen deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete fiveRsNamkeen', error });
    }
});

module.exports = router;
