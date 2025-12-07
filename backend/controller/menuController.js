const Menu = require("../models/menuModel");

const cloudinary = require("cloudinary").v2;


const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category || !req.file) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newMenuItem = await Menu.create({
            name,
            description,
            price,
          category,
            image: result.secure_url,
        });

        res.status(201).json({
            message: "Menu item added",
            success: true,
            menuItem: newMenuItem,
        });

    } catch (error) {
        console.error(error);
        return res.json({ message: "Internal server error", success: false });
    }
};




const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, available } = req.body;

        const updateData = { name, description, price, category, available };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.image = result.secure_url;
        }

        const updatedMenuItem = await Menu.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMenuItem) {
            return res.status(404).json({ message: "Menu item not found", success: false });
        }
        await updatedMenuItem.save();

        res.status(200).json({
            message: "Menu item updated",
            success: true,
            menu: updatedMenuItem,
        });

    } catch (error) {
        console.error(error);
        return res.json({ message: "Internal server error", success: false });
    }
}

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMenuItem = await Menu.findByIdAndDelete(id);

        if (!deletedMenuItem) {
            return res.status(404).json({ message: "Menu item not found", success: false });
        }

        res.status(200).json({
            message: "Menu item deleted",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.json({ message: "Internal server error", success: false });
    }
}


const getAllMenuItems = async(req, res) => {
    try {

        const menuItem = await Menu.find().populate('category','name').sort({ createdAt: -1 });

        res.status(200).json({ menuItem, success: true });

    } catch (error) {
        console.error(error);
        return res.json({ message: "Internal server error", success: false });
    }
}


module.exports = {    
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getAllMenuItems

};