const responder = require('../models/Responder');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

function handleError(response, errorMessage) {
  console.error(errorMessage); // Log the error message to console for debugging
  response.status(500).send('Internal Server Error'); // Send a generic error response with status code 500
}
function errorFn(err){
  console.log('Error found. Please trace!');
  console.error(err);
}

// function to get users for search users
function getSearchUsers(profileDetails) {
  return responder.Profile.find().then(function(users) {
    console.log('List successful');
    let userList = [];
    for (const user of users) {
      if (!user.isDeleted) {
        userList.push({
          _id: user._id.toString(),
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
        });
      }
    }
    console.log("user res: " + userList);
    return userList;
  }).catch(errorFn);
}

// Get the parent directory of the current script's directory (remove \controllers)
const parentDir = path.dirname(__dirname);

// Define the destination directory using path.join()
const destinationDirectory = path.join(parentDir, 'public', 'common', 'CSS & Assets', 'Assets');

// Multer configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, destinationDirectory);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// function to get reservations for lab techs
function getLabTechReservations(profileDetails) {
  return responder.Reservation.find().then(function(reservations) {
    console.log('List successful');
    let userReservations = [];
    for (const item of reservations) {
      if (!item.isDeleted) {
        userReservations.push({
          _id: item._id.toString(),
          lab: item.lab,
          seat: item.seat,
          requestDT: item.requestDT,
          reserveDT: item.reserveDT,
          type: item.type,
          requesterID: item.requesterID,
          requestFor: item.requestFor,
          isDeleted: item.isDeleted
        });
      }
    }
    console.log("user res: " + userReservations);
    return userReservations;
  }).catch(errorFn);
}

// function to get reservations for students
function getStudentReservations(profileDetails) {
  const searchQuery = { requesterID: profileDetails.idNum };
  return responder.Reservation.find(searchQuery).then(function(reservations) {
    console.log('List successful');
    let userReservations = [];
    for (const item of reservations) {
      if (!item.isDeleted) {
        userReservations.push({
          lab: item.lab,
          seat: item.seat,
          requestDT: item.requestDT,
          reserveDT: item.reserveDT,
          type: item.type
        });
      }
    }
    return userReservations;
  }).catch(errorFn);
}
function generateUniqueId(prefix) {
  const characters = '0123456789';
  const idLength = 8;
  let id = prefix;

  for (let i = 0; i < idLength; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return id;
}

// Function to check if the generated ID already exists in the database
async function isIdUnique(id) {
  const result = await responder.Profile.findOne({ idNum: id });
  return result === null;
}

// Function to generate unique IDs with the specified prefix
async function generateUniqueUserId(prefix) {
  let id;
  do {
    id = generateUniqueId(prefix);
  } while (!(await isIdUnique(id)));

  return id;
}
function add(server){
  let profileDetails = {
    firstName: '',
    lastName: '',
    role: '',
    bio: '',
    email: '',
    idNum: '',
    birthday: '',
    pronouns: '',
    pic: '',
    isPublic: false,
    isLabtech: false
  };
  
  //login page
  server.get('/', function(req, resp){
    resp.render('login',{
        layout: 'index',
        title: 'ILabYou Login Page',
        filename: 'login'
    });
  });

  //signup page
  server.get('/signup', function(req, resp){
    resp.render('signup',{
        layout: 'index',
        title: 'ILabYou Signup Page',
        filename: 'signup'
    });
  });


  //store account details 
  server.get('/homepage', function(req, resp){
    
    resp.render('homepage',{
      layout: 'index',
      title: 'ILabYou - We Lab to Reserve for You',
      filename: 'user_homepage',
      profileDetails: profileDetails
    });
    
    // Example usage:
    const numColumns = 9; // Specify the number of columns
    const seats = generateSeatNumbers(numColumns);
    console.log(seats);
    console.log("Profile pic: " + profileDetails.pic);
  });
  // Route handler for uploading profile pictures
server.post('/upload-pfp', upload.single('profilePicture'), async (req, res) => {
  try {
      // Handle file upload with Multer
      console.log('Received request to upload profile picture');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
      // Store file data (e.g., file path or filename) in MongoDB database
      const updateQuery = { idNum: req.body.id };
      newPfp = '/common/CSS & Assets/Assets/' +  req.file.filename;
      const updateValues = { $set: { pic: newPfp} };
      responder.Profile.updateOne(updateQuery, updateValues).then(function(){
        console.log("Saved successfully");
        
        profileDetails.pic = newPfp;
        res.status(200).send('Profile picture uploaded successfully');
      }

      );
    
      
  } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).send('Error uploading profile picture');
  }
});
  server.get('/profile', function(req, resp){
    if (profileDetails.isLabtech) {
       getLabTechReservations(profileDetails).then(function(userReservations) {
        reservations = userReservations;
        renderPage();
      });
    } else {
      getStudentReservations(profileDetails).then(function(userReservations) {
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
  

    // login and find user
    server.post('/read-user', function(req, resp) {
      let searchUser = { username: req.body.email };
      let password = req.body.password;
  
      responder.Login.findOne(searchUser).then(function(user) {
      console.log('Finding user');
  
      if (user != undefined && user._id != null) {
        bcrypt.compare(password, user.password, function(err, result) {
          if (result) {
              // Once login is found, find the corresponding profile
              responder.Profile.findOne({ email: user.username }).then(function(profile) {
                if (profile != undefined && profile._id != null) {
                    // Merge login and profile details
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
                        isLabtech: profile.isLabtech
                    };

                    // Save sessionProfile in session for future use
                    profileDetails = sessionProfile;
                    console.log("email: " + profileDetails.email)
  
                    // Redirect to homepage and override profileDetails with sessionProfile
                    resp.redirect('/homepage');
                } else {
                    handleError(resp, 'Profile not found for the logged-in user');
                  }
              }).catch(error => {handleError(resp, 'Error finding profile: ' + error);
                  });
          } else { handleError(resp, 'Profile not found for the logged-in user');}
        });
      } else {
          // Login details not found or incorrect
          resp.redirect('/');
        }
      }).catch(error => {handleError(resp, 'Error finding user: ' + error);});
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

  generateUniqueUserId(prefix).then((newId) => {
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
      isLabtech: isLabtech
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

    
    
server.get('/view-reservations', function(req, resp) {
  let reservations = []; // Initialize reservations array

  if (profileDetails.isLabtech) {
    getLabTechReservations(profileDetails).then(function(userReservations) {
      reservations = userReservations;
      renderPage();
    });
  } else {
    getStudentReservations(profileDetails).then(function(userReservations) {
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


    // choose lab
    server.get('/choose-lab', function(req, resp){
      resp.render('choose-lab',{
        layout: 'index',
        title: 'ILabYou - We Lab to Reserve for You',
        filename: 'choose-lab'
      });
    });

    
  //reserve
  
function generateSeatNumbers(numColumns) {
  const numRows = 3; // Fixed number of rows
  const rows = ['A', 'B', 'C']; // Fixed row labels
  const seatNumbers = [];

  for (let row of rows) {
    for (let col = 1; col <= numColumns; col++) {
      seatNumbers.push(row + col);
    }
  }

  return seatNumbers;
}

  const fs = require('fs');

    server.get('/reserve', (req, res) => {
      try {
        // Read lab details from the JSON file
        const labDetails = JSON.parse(fs.readFileSync('JSON files/labDetails.json', 'utf8'));
    
        // Check if a specific lab index is requested
        const labIndex = req.query.lab;
        console.log('Requested lab index:', labIndex); // Debugging output
    
        if (labIndex !== undefined && labIndex >= 0 && labIndex < labDetails.length) {
          
          // Retrieve the lab with the specified index
          const selectedLab = labDetails[labIndex];
          selectedLab.seatNumbers = generateSeatNumbers(selectedLab.columns);
          // Render the reserve.hbs template with the selected lab
          res.render('reserve', {
            layout: 'index',
            title: 'ILabYou - We Lab to Reserve for You',
            filename: 'reserve',
            profileDetails: profileDetails,
            selectedLab: selectedLab
          });
        } else {
          // Invalid lab index or no specific lab requested, render the page without selecting any lab
          const selectedLab = labDetails[0];
          selectedLab.seatNumbers = generateSeatNumbers(selectedLab.columns);
          res.render('reserve', {
            layout: 'index',
            title: 'ILabYou - We Lab to Reserve for You',
            filename: 'reserve',
            profileDetails: profileDetails,
            selectedLab: selectedLab
          });
        }
      } catch (error) {
        console.error('Error rendering reserve page:', error);
        res.status(500).send('Internal Server Error');
      }
    });
    


  server.get('/search', function(req, resp) {
    getSearchUsers(profileDetails).then(function(userList) {
      resp.render('search', {
        layout: 'index',
        title: 'ILabYou - We Lab to Reserve for You',
        filename: 'search',
        profileDetails: profileDetails,
        users: userList
      });
    }).catch(error => {
      console.error("Error in getting search users: ", error);
      // Handle error here if needed
      resp.status(500).send("Internal Server Error");
    });
  });
  

  server.get('/user', function(req, resp) {
    const userId = req.query.id; // Retrieve the user ID from the query parameter

    // Find the user based on the ID
    responder.Profile.findById(userId).then(function(user) {
        // Initialize reservations array
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
        // Check if the user is a lab tech or a student
        if (user.isLabtech) {
            getLabTechReservations(userProfile).then(function(userReservations) {
                reservations = userReservations;
                console.log("User: " + userProfile);
                console.log("reservations: " + reservations);
                renderPage(userProfile, reservations);
            });
        } else {
            getStudentReservations(userProfile).then(function(userReservations) {
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
                user: user, // Pass the user's data to the template
                reservations: reservations // Pass reservations to the template
            });
        }
    }).catch(error => {
        handleError(resp, 'Error finding user: ' + error);
    });
});
  
  }     

 module.exports.add = add;

