// controllers/announcementController.js
const Announcement = require('../models/Announcement');

// GET method latest
exports.getLatestAnnouncement = async (req, res)=> {
    try{
        const LatestAnnouncement = await Announcement.findOne().sort({ create_date : -1});
        
        if (!LatestAnnouncement){
            return res.status(404).json({ message : "no annonucement found"});
        }
        console.log(" get Latest Announcement");
        res.status(200).json({
            message : "Latest Announcement retrived successfully",
            announcement : LatestAnnouncement
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message : "Server Error"});
    }
};

exports.getAllAnnouncement = async (req, res)=> {
    try{
        const Announcements = await Announcement.find().sort({ create_date : -1});
        
        if (!Announcements || Announcements.length === 0){
            return res.status(404).json({ message : "no annonucement found"});
        }
        console.log(" get all Announcement");
        res.status(200).json({
            message : "Announcements retrived successfully",
            announcement : Announcements
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message : "Server Error"});
    }
};

// Post method
exports.AnnouncementCreate = async (req, res)=>{
    try{
        // Extract 'Items' from the request body
        const { Items, User_id }  = req.body;

        // Check if 'Items' and User_id exist
        if (!User_id || !Items) {
            res.send(400).json({ message : "User and Items are required"});
            }
        const NewAnnouncement = new Announcement({
            Items,
            User_id,
            create : new Date() // Use current date
        });
        // Save the new announcement to the database
        const SavedAnnouncement = await NewAnnouncement.save();
        res.status(201).json({
            message : "Announcement create successfully",
            announcement: SavedAnnouncement
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server Error"})
    }
};