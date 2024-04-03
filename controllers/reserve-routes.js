//default declarations
const fn = require('./functions');
const { updateProfileDetails, profileDetails } = require('./profileDetails');
const responder = require('../models/Responder');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/labDB');
const mongo_uri = 'mongodb://127.0.0.1:27017/labDB';
mongoose.connect(mongo_uri);
const session = require('express-session');
const { createBrotliCompress } = require('zlib');
const mongoStore = require('connect-mongodb-session')(session);

const fs = require('fs'); //remove once db lab load fixed

function add(server){
    server.get('/view-reservations', function(req, resp) {
        let reservations = []; // Initialize reservations 
      
        if (profileDetails.isLabtech) {
            fn.getLabTechReservations(profileDetails).then(function(userReservations) {
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
            console.log("Res inside: " + reservations);
            resp.render('view_reservations', {
                layout: 'index',
                title: 'ILabYou - We Lab to Reserve for You',
                filename: 'view_reservations',
                profileDetails: profileDetails,
                reservations: reservations
            });
        }
    });
    server.put('/delete-reservation/:id', async (req, res) => {
        const reservationId = Object(req.params.id);
        const updateQuery = { _id: reservationId};
        const updateValues = { $set: { isDeleted: true} };
        responder.Reservation.updateOne(updateQuery, updateValues).then(function(){
            console.log("deleted successfully, _id: " + req.params.id);  
            res.status(200).send('Profile picture uploaded successfully');
        });
    });
    server.get('/choose-lab', function(req, resp){
        resp.render('choose-lab',{
            layout: 'index',
            title: 'ILabYou - We Lab to Reserve for You',
            filename: 'choose_lab',
            profileDetails: profileDetails
        });
    });
    // Server-side endpoint to fetch lab details
server.get('/getLabDetails', async function(req, res){
    try {
        // Fetch lab details from the database
        const labDetails = await responder.Lab.find({}, { labIndex: 1, labName: 1, columns: 1, img: 1 }).lean(); // Query to get labIndex, labName, and columns, and convert Mongoose documents to plain JavaScript objects
        
        res.json({ labDetails });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
server.get('/reserve', async (req, res) => {
    try {
        // Read the lab index from the query parameters
        const labIndex = req.query.lab;
        console.log('Requested lab index:', labIndex); // Debugging output

        if (labIndex !== undefined) {
            // Fetch lab details from the database
            const labDetails = await responder.Lab.find({}, { labIndex: 1, labName: 1, columns: 1, img: 1 }).lean();

            // Check if the requested lab index is valid
            if (labIndex >= 0 && labIndex < labDetails.length) {
                // Retrieve the lab with the specified index
                const selectedLab = labDetails[labIndex];
                selectedLab.seatNumbers = fn.generateSeatNumbers(selectedLab.columns);

                // Render the reserve.hbs template with the selected lab
                res.render('reserve', {
                    layout: 'index',
                    title: 'ILabYou - We Lab to Reserve for You',
                    filename: 'reserve',
                    profileDetails: profileDetails,
                    selectedLab: selectedLab
                });
            } else {
                // Invalid lab index, render the page without selecting any lab
                res.render('reserve', {
                    layout: 'index',
                    title: 'ILabYou - We Lab to Reserve for You',
                    filename: 'reserve',
                    profileDetails: profileDetails,
                    selectedLab: null // Pass null as selectedLab since the index is invalid
                });
            }
        } else {
            // No lab index provided, render the page without selecting any lab
            res.render('reserve', {
                layout: 'index',
                title: 'ILabYou - We Lab to Reserve for You',
                filename: 'reserve',
                profileDetails: profileDetails,
                selectedLab: null // Pass null as selectedLab since no index is provided
            });
        }
    } catch (error) {
        console.error('Error rendering reserve page:', error);
        res.status(500).send('Internal Server Error');
    }
});

    server.get('/findUser_id/:id', function(req, resp) {
        const idNum = req.params.id;
        console.log("idNum: "+ idNum);
        const searchQuery = { idNum: idNum};
        responder.Profile.findOne(searchQuery).then(function(result){
            const id = result._id;
            console.log("_id: " + result._id.toString());
            resp.redirect(`/user?id=${id}`);
        }); 
    }); 
}

module.exports.add = add;
