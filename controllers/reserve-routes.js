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

 server.get('/getReserveData', async function(req, res){
    try {
        // Fetch reserve data from the database
        const reservationData = await responder.Reservation.find({}, { lab: 1, seats: 1, requestDT: 1, reserveDT: 1, type: 1, requesterID: 1, requestFor: 1, isDeleted: 1 }).lean();
        
        res.json({ reservationData });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
 });



 server.get('/reserve', async (req, res) => {
    try {
        // Read the lab index from the query parameters
        let reservationData = await responder.Reservation.find({}, { lab: 1, seats: 1, requestDT: 1, reserveDT: 1, type: 1, requesterID: 1, requestFor: 1, isDeleted: 1 }).lean();
        let labIndex = req.query.lab;
        console.log('Requested lab index:', labIndex); // Debugging output
        if (labIndex == undefined)
            labIndex = 0;
        // Fetch lab details from the database
        let labDetails = await responder.Lab.find({}, { labIndex: 1, labName: 1, columns: 1, img: 1 }).lean();

        // Check if the requested lab index is valid
        if (labIndex >= 0 && labIndex < labDetails.length) {
            // Retrieve the lab with the specified index
            let selectedLab = labDetails[labIndex];
            selectedLab.seatNumbers = fn.generateSeatNumbers(selectedLab.columns);
          
            res.render('reserve', {
                layout: null,
                title: 'ILabYou - We Lab to Reserve for You',
                profileDetails: profileDetails,
                selectedLab: selectedLab,
                reservationData : reservationData
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


    server.post('/create-reservation', async (req, res) => {
        try {
            const { lab, seats, requestDT, reserveDT, type, requesterID, requestFor, isDeleted } = req.body;
            
            // Call saveStudentReservation function to save reservation
            await fn.saveStudentReservation({
                lab,
                seats,
                requestDT,
                reserveDT,
                type,
                requesterID,
                requestFor,
                isDeleted
            });
    
            res.status(201).send("Reservation saved successfully.");
        } catch (error) {
            console.error("Error saving reservation:", error);
            res.status(500).send("Internal Server Error");
        }
    });
    
    
}
module.exports.add = add;
