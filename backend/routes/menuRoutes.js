const express = require('express');
const { adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

const { addMenuItem, updateMenuItem, deleteMenuItem, getAllMenuItems } = require('../controller/menuController');


const router = express.Router();



router.post('/add',adminOnly,upload.single('image'),addMenuItem);

router.put('/update/:id',adminOnly,upload.single('image'),updateMenuItem);

router.delete('/delete/:id',adminOnly,deleteMenuItem);

router.get('/all',getAllMenuItems);









module.exports = router;