//default declarations
const fn = require('./functions');
const { updateProfileDetails, profileDetails } = require('./profileDetails');
const responder = require('../models/Responder');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const parentDir = path.dirname(__dirname);
const destinationDirectory = path.join(parentDir, 'public', 'common', 'CSS & Assets', 'Assets');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, destinationDirectory);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

function add(server){
    server.post('/upload-pfp', upload.single('profilePicture'), async (req, res) => {
        try {
            // Handle file upload with Multer
            console.log('Received request to upload profile picture');
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);
            const updateQuery = { idNum: req.body.id };
            newPfp = '/common/CSS & Assets/Assets/' +  req.file.filename;
            const updateValues = { $set: { pic: newPfp} };
            responder.Profile.updateOne(updateQuery, updateValues).then(function(){
                console.log("Saved successfully");
                updateProfileDetails({pic: newPfp});
                res.status(200).send('Profile picture uploaded successfully');
            }); 
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            res.status(500).send('Error uploading profile picture');
        }
    });
    server.post('/save-pfp', async (req, res) => {
        try {
            const { idNum, firstName, lastName, birthday, pronouns, bio } = req.body;
            const updateQuery = { idNum: idNum };
            const updateValues = { $set: 
              { firstName: firstName,
                lastName: lastName,
                birthday: birthday,
                pronouns: pronouns,
                bio: bio           
            }};
            await responder.Profile.updateOne(updateQuery, updateValues).then(function(){ //save to db
                console.log("Saved successfully");
                updateProfileDetails({ 
                    firstName: firstName,
                    lastName: lastName,
                    birthday: birthday,
                    pronouns: pronouns,
                    bio: bio
                });
                res.status(200).send('Profile updated successfully');
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });  
    server.get('/profile', function(req, resp){
        if (profileDetails.isLabtech) {
            fn.getLabTechReservationsByID(profileDetails).then(function(userReservations) {
                reservations = userReservations;
                renderPage();
            });
        } else {
            fn.getStudentReservations(profileDetails).then(function(userReservations) {
                reservations = userReservations;
                renderPage();
            });
          }
        function renderPage() {
            resp.render('profile',{
                layout: 'index',
                title: 'ILabYou - We Lab to Reserve for You',
                filename: 'user_profile',
                profileDetails: profileDetails,
                reservations: reservations
            });
        }
    });
}

module.exports.add = add;
