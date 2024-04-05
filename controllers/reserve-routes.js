//default declarations
const fn = require('./functions');
const { updateProfileDetails, profileDetails } = require('./profileDetails');
const responder = require('../models/Responder');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
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

            // Render the reserve.hbs template with the selected lab
            res.render('reserve', {
                layout: null,
                title: 'ILabYou - We Lab to Reserve for You',
                profileDetails: profileDetails,
                selectedLab: selectedLab
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
            const { lab, seats, requestDT, reserveDT, type, requesterID, requestFor, isAnonymous, isDeleted } = req.body;
            
            // Call savetReservation function to save reservation
            await fn.saveReservation({
                lab,
                seats,
                requestDT,
                reserveDT,
                type,
                requesterID,
                requestFor,
                isAnonymous,
                isDeleted
            });
    
            res.status(201).send("Reservation saved successfully.");
        } catch (error) {
            console.error("Error saving reservation:", error);
            res.status(500).send("Internal Server Error");
        }
    });
    
    
    server.get('/checkReservations', async function(req, res) {
        try {
            const { lab, date, time, currentRequesterID } = req.query;
    
            // Log the values of lab, date, and time for debugging
            console.log('Lab:', lab);
            console.log('Date:', date);
            console.log('Time:', time);
            console.log('ID:', currentRequesterID);
            
            // Step 1: Retrieve Reservation Data
            const combinedDateTime = date + ' ' + time;
    
            // Log the combinedDateTime for debugging
            console.log('Combined DateTime:', combinedDateTime);
            console.log('Current Lab:', lab);
            // Retrieve reservations from the database
            const reservations = await responder.Reservation.find({ 
                lab: lab, 
                reserveDT: combinedDateTime, 
                isDeleted: false
            });
    
            console.log('Retrieved Reservations:', reservations);
    
            // Extract reserved seats
            const reservedSeats = reservations.flatMap(reservation => reservation.seats);
    
            // Extract requesterID of each reservation
            const reservationRequesterIDs = reservations.map(reservation => reservation.requesterID);
    
            console.log('Reserved Seats:', reservedSeats);
            console.log('Reservation Requester IDs:', reservationRequesterIDs);
    
            // Check if the current requesterID matches any of the reservation requesterIDs
            const isCurrentRequester = reservationRequesterIDs.includes(currentRequesterID);
    
            console.log('Is Current Requester:', isCurrentRequester);
    
            // Step 3: Send Reserved Seat Numbers, Reservation Requester IDs, and Current Requester Status to Frontend
            res.json({ reservedSeats, reservationRequesterIDs, isCurrentRequester });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    server.post('/update-res-status', (req, res) => {
        const id = req.body._id;
        responder.Reservation.findByIdAndUpdate(id, { status: 'Present' }, { new: true })
        .then(updatedReservation => {
            console.log('Updated reservation:', updatedReservation);
            res.status(200).send({ message: 'Reservation status updated successfully', updatedReservation });
        })
        .catch(error => {
            console.error('Error updating reservation:', error);
            res.status(500).send({ error: 'Internal server error' });
        });
    });

    server.get('/edit_reserve/:reservationId', async (req, res) => {
        try {
            const reservationId = req.params.reservationId;
            const reservation = await responder.Reservation.findById(reservationId).lean();
            if (!reservation) {
                return res.status(404).send('Reservation not found');
            }
            
            // Fetch lab details from the database
            let labDetails = await responder.Lab.find({}, { labIndex: 1, labName: 1, columns: 1, img: 1 }).lean();
            let selectedLab = {};
            let firstSpaceIndex = reservation.reserveDT.indexOf(' ', reservation.reserveDT.indexOf(' '));
            let substringAfterFirstSpace = reservation.reserveDT.substring(firstSpaceIndex + 1);
            let reservationTime = substringAfterFirstSpace;
            let reservationDate = reservation.reserveDT.substring(0, firstSpaceIndex);
            let reservationSeats = reservation.seats;
            let seatsString = reservationSeats.join(',');
            reservationSeats.forEach(seat => {
                console.log(seat); // Output each seat identifier, such as A1, A2, etc.
            });

                for (let i = 0; i < labDetails.length; i++) {
                    if (labDetails[i].labName === reservation.lab) {
                        selectedLab = labDetails[i];
                        console.log("Selected Lab index: " + i);
                        selectedLab.seatNumbers = fn.generateSeatNumbers(selectedLab.columns);
                    }
                }
                
                 // Render the edit_reserve.hbs template with the selected reservation and lab details
                res.render('edit_reserve', {
                    layout: null,
                    title: 'ILabYou - We Lab to Reserve for You',
                    profileDetails: profileDetails,
                    selectedLab: selectedLab,
                    reservation: reservation,
                    reservationId: reservationId,
                    reservationSeats: seatsString,
                    reservationDate: reservationDate,
                    reservationTime: reservationTime,
                    reservationType: reservation.type
                });  
        } catch (error) {
            console.error('Error rendering reserve page:', error);
            res.status(500).send('Internal Server Error');
        }
    });

server.post('/update-reservation/:reservationId', async (req, res) => {
    try {
        const reservationId = req.params.reservationId.slice(1);
        
        const { lab, seats, requestDT, reserveDT, type, requesterID, requestFor, isAnonymous, isDeleted } = req.body;
        console.log(reservationId);
        // Convert reservationId string to a valid ObjectId
        
        const validReservationId = new ObjectId(reservationId);
        
        // Find the existing reservation by ID
        const existingReservation = await responder.Reservation.findById(validReservationId);

        if (!existingReservation) {
            return res.status(404).send('Reservation not found');
        }

        // Update the existing reservation with the new data
        existingReservation.lab = lab;
        existingReservation.seats = seats;
        existingReservation.requestDT = requestDT;
        existingReservation.reserveDT = reserveDT;
        existingReservation.type = type;
        existingReservation.requesterID = requesterID;
        existingReservation.requestFor = requestFor;
        existingReservation.isAnonymous = isAnonymous;
        existingReservation.isDeleted = isDeleted;

        // Save the updated reservation
        await existingReservation.save();

        res.status(200).send("Reservation updated successfully.");
    } catch (error) {
        console.error("Error updating reservation:", error);
        res.status(500).send("Internal Server Error");
    }
});


    
}

module.exports.add = add;
