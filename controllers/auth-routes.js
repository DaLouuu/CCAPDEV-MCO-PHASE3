//default declarations
const fn = require('./functions');
const { updateProfileDetails, profileDetails } = require('./profileDetails');
const responder = require('../models/Responder');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const session = require('express-session');
const { createBrotliCompress } = require('zlib');
const mongoStore = require('connect-mongodb-session')(session);



// Create a new MongoDB session store



function add(server){
    // Load environment variables

    //const mongoURI = process.env.MONGODB_URI;
    const mongoURI = 'mongodb://127.0.0.1:27017/labDB';

    // Log the value of mongoURI for debugging
    console.log('MongoDB URI:', mongoURI);

    // Connect to MongoDB using the environment variable
    mongoose.disconnect();
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    const store = new mongoStore({
        uri: mongoURI,
        collection: 'sessions'
    });

    server.use(session({
        secret: 'sikret',
        saveUninitialized: true,
        resave: false,
        store: store
    }));

    
    server.get('/', function(req, resp){
        resp.render('login',{
            layout: 'index',
            title: 'ILabYou Login Page',
            filename: 'login'
        });
    });
    
    server.get('/signup', function(req, resp){
        resp.render('signup',{
            layout: 'index',
            title: 'ILabYou Signup Page',
            filename: 'signup'
        });
    });
    
    server.get('/homepage', function(req, resp){
        if(req.session.login_id == undefined){
            resp.redirect('/');
            return;
        }
        resp.render('homepage',{
            layout: 'index',
            title: 'ILabYou - We Lab to Reserve for You',
            filename: 'user_homepage',
            profileDetails: profileDetails
        });
        console.log("USER ID:", req.session.login_user);
        console.log("SESSION ID: ", req.session.login_id);
    });

    server.post('/read-user', function(req, resp) {
        let searchUser = { username: req.body.email };
        let password = req.body.password;

        if (searchUser === null || password === null) {
            console.log('Please complete all required fields.');
          }
          
    
        responder.Login.findOne(searchUser).then(function(user) {
        console.log('Finding user');
      
        if (user != undefined && user._id != null) {
            bcrypt.compare(password, user.password, function(err, result) {
            if (result) {
                // Once login is found, find the corresponding profile
                responder.Profile.findOne({ email: user.username }).then(function(profile) {
                    if (profile != undefined && profile._id != null && profile.isDeleted != true) {
                        const sessionProfile = {
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            role: profile.role,
                            bio: profile.bio,
                            email: profile.email,
                            idNum: profile.idNum,
                            birthday: profile.birthday,
                            pronouns: profile.pronouns,
                            pic: profile.pic,
                            isPublic: profile.isPublic,
                            isLabtech: profile.isLabtech,
                            isDeleted: profile.isDeleted
                        };
                        updateProfileDetails(sessionProfile);   //save sessionProfile
                        let expiration;
                        if (req.body.remember === "true") {
                            expiration = 21 * 24 * 60 * 60 * 1000; // 14 days
                        } else {
                            expiration = 1000 * 60 * 60; // 1 hour
                        }
                        // Create session with updated expiration
                        req.session.expires = expiration;
                        //session
                        req.session.login_user = profile._id;
                        req.session.login_id = req.sessionID;
                        // Redirect to homepage and override profileDetails with sessionProfile
                        resp.redirect('/homepage');
                    } else {
                        // Profile not found or deleted
                        fn.handleError(resp, 'Profile not found for the logged-in user');
                        resp.redirect('/');
                    }
                }).catch(error => {
                    fn.handleError(resp, 'Error finding profile: ' + error);
                    resp.redirect('/');
                });
            } else {
                // Password incorrect
                fn.handleError(resp, 'Incorrect password');
                resp.redirect('/');
            }
            });
        } else {
            // User not found
            fn.handleError(resp, 'User not found');
            resp.redirect('/');
        }}).catch(error => {
            fn.handleError(resp, 'Error finding user: ' + error);
            resp.redirect('/');
        });
    });
      
    //creates user
    server.post('/create-user', function(req, resp) {
        // Check if password and confirmPass match
        if (req.body.password !== req.body.confirmPass) {
            console.error('Error: Passwords do not match');
            resp.redirect('/'); // Redirect to home page if passwords do not match
            return; // Exit the function to prevent further execution
        }
        let prefix = '';
        let isLabtech = true;
        if (req.body.choice == 'labtech')
            prefix = "LT";
        else {
            prefix = "ST";
            isLabtech = false;
        }
        fn.generateUniqueUserId(prefix).then((newId) => {
            console.log("Unique ID:", newId);
        
            const saltRounds = 10;
            let default_pass = req.body.password;
        
            bcrypt.hash(default_pass, saltRounds).then(hash => {
                    const encrypted_pass = hash;
                    console.log("Encrypted pass:", encrypted_pass);
                
                    const loginInstance = responder.Login({
                        username: req.body.email,
                        password: encrypted_pass,
                        role: req.body.choice
                    });
            
                const profileInstance = responder.Profile({
                firstName: 'New User',
                lastName: '',
                role: req.body.choice,
                bio: '',
                email: req.body.email,
                idNum: newId,
                birthday: '',
                pronouns: '',
                pic: '/common/CSS & Assets/Assets/default_pfp.jpg',
                isPublic: true,
                isLabtech: isLabtech,
                isDeleted: false
                });
            
                // Save the instances to the database
                loginInstance.save().then(function(login) {
                console.log('User created');
                profileInstance.save();
                resp.redirect('/'); // Redirect to home page after successful creation
                }).catch(error => {
                console.error('Error saving user:', error);
                resp.redirect('/'); // Redirect to home page in case of error
                });
            }).catch(error => {
                console.error('Error generating unique user ID:', error);
                resp.redirect('/'); // Redirect to home page in case of error
            });
        }).catch(err => {
            // Handle errors during hashing
            console.error("Error hashing password:", err);
        });  
    });
    
    //delete user
    server.post('/delete-user', function(req, resp) {
        const userId = req.session.login_user; // Assuming login_user stores the user ID
        const choice = req.body.choice;
        if (choice === 'yes'){
            responder.Profile.findByIdAndUpdate(userId, { isDeleted: true }).then(userDelete => {
                if (userDelete) {
                    console.log("User deleted successfully: ", userDelete);
                    req.session.destroy(function(err) {
                    console.log("Session destroyed.");
                    resp.redirect('/');
                    });
                } else {
                    console.error('User not found for deletion');
                    resp.status(404).send('User not found'); // User not found error
                }
            }).catch(error => {
                console.error('Error deleting user:', error);
                resp.status(500).send('Error deleting user'); // Internal server error
            });
        }
        else {
            resp.redirect('/profile');
        }
    });

    server.get('/logout', function(req, resp){
        req.session.destroy(function(err) {
          console.log("Session destroyed. Successfully logged out.");
            resp.redirect('/');
        });
      });
}

module.exports.add = add;