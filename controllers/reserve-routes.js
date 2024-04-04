//default declarations
const fn = require('./functions');
const { updateProfileDetails, profileDetails } = require('./profileDetails');
const responder = require('../models/Responder');


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


    // server.get('/edit_reserve', async (req, res) => {
    //     try {
    //         // Read the lab index from the query parameters
    //         let labIndex = req.query.lab;
    //         console.log('Requested lab index:', labIndex); // Debugging output
    //         if (labIndex == undefined)
    //             labIndex = 0;
    //         // Fetch lab details from the database
    //         let labDetails = await responder.Lab.find({}, { labIndex: 1, labName: 1, columns: 1, img: 1 }).lean();
    
    //         // Check if the requested lab index is valid
    //         if (labIndex >= 0 && labIndex < labDetails.length) {
    //             // Retrieve the lab with the specified index
    //             let selectedLab = labDetails[labIndex];
    //             selectedLab.seatNumbers = fn.generateSeatNumbers(selectedLab.columns);
    
    //             // Render the edit_reserve.hbs template with the selected lab
    //             res.render('edit_reserve', {
    //                 layout: null,
    //                 title: 'ILabYou - We Lab to Reserve for You',
    //                 profileDetails: profileDetails,
    //                 selectedLab: selectedLab
    //             });
    //         }    
            
    //     } catch (error) {
    //         console.error('Error rendering reserve page:', error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // });

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
            // let substringBeforeFirstSpace = reservation.reserveDT.substring(reservation.reserveDT - firstSpaceIndex);


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
                    // reservationDate: reservationDate,
                    reservationTime: reservationTime
                });  
        } catch (error) {
            console.error('Error rendering reserve page:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    
    server.post('/update-reservation', (req, res) => {
        try {
            const reservationId = req.params.reservationId;
            const { lab, seats, requestDT, reserveDT, type, requesterID, requestFor, isAnonymous} = req.body;

            console.log(req.body);
    
            responder.Reservation.findByIdAndUpdate(reservationId, { 
                lab: lab,
                seats: seats,
                requestDT: requestDT, 
                reserveDT: reserveDT,
                type: type,
                requesterID: requesterID,
                requestFor: requestFor,
                isAnonymous: isAnonymous,
             }).then(() => {
                // Respond with a success message
                res.status(200).json({ message: 'Reservation updated successfully' });
                resp.redirect('/view-reservations');
            });
    
        } catch (error) {
            // If an error occurs, respond with an error status code and message
            console.error('Error updating reservation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        
    });
    

}

module.exports.add = add;
