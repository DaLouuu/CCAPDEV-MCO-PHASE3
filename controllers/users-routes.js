//default declarations
const fn = require('./functions');
const { updateProfileDetails, profileDetails } = require('./profileDetails');
const responder = require('../models/Responder');


function add(server){
    server.get('/user', function(req, resp) {
        const userId = Object(req.query.id); 
        responder.Profile.findById(userId).then(function(user) {
            let reservations = [];
            let userProfile = {
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                bio: user.bio,
                email: user.email,
                idNum: user.idNum,
                birthday: user.birthday,
                pronouns: user.pronouns,
                pic: user.pic,
                isPublic: user.isPublic,
                isLabtech: user.isLabtech
            };
            // use same function for both, 
            //because we need to show the reservations made by this specific user and not what is visible on their end
            if (user.isLabtech){
              fn.getLabTechReservationsByID(userProfile).then(function(userReservations) {
                reservations = userReservations;
                console.log(reservations)
                renderPage(userProfile, reservations);
              });
            }else {
              fn.getStudentReservations(userProfile).then(function(userReservations) {
                reservations = userReservations;
                console.log("User: " + userProfile);
                console.log("reservations: " + reservations);
                renderPage(userProfile, reservations);
              });
            }
            // Function to render the page after fetching reservations
            function renderPage(user, reservations) {
                resp.render('user', {
                    layout: 'index',
                    title: 'ILabYou - User Profile',
                    filename: 'user',
                    profileDetails: profileDetails,
                    user: user, 
                    reservations: reservations 
                });
            }
        }).catch(error => {
          fn.handleError(resp, 'Error finding user: ' + error);
        });
    });
    server.get('/search', function(req, resp) {
        fn.getSearchUsers(profileDetails).then(function(userList) {
            resp.render('search', {
                layout: 'index',
                title: 'ILabYou - We Lab to Reserve for You',
                filename: 'search',
                profileDetails: profileDetails,
                users: userList
            });
        }).catch(error => {
            console.error("Error in getting search users: ", error);
            resp.status(500).send("Internal Server Error");
        });
    });    
}

module.exports.add = add;
