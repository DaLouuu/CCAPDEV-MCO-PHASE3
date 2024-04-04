//default declarations
const responder = require('../models/Responder');



function handleError(response, errorMessage) {
    //console.error(errorMessage); // Log the error message to console for debugging
    response.status(500).send(errorMessage); // Send a generic error response with status code 500
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
        if (!user.isDeleted && profileDetails.idNum != user.idNum) {
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
  // function to get reservations for lab techs
function getLabTechReservations() {
    return responder.Reservation.find().then(function(reservations) {
      console.log('List successful');
      let userReservations = [];
      
      for (const item of reservations) {
        const concatenatedSeats = item.seats.join(', ');
        if (!item.isDeleted) {
          userReservations.push({
            _id: item._id.toString(),
            lab: item.lab,
            seat: concatenatedSeats,
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
  function getLabTechReservationsByID(profileDetails) {
    const searchQuery = { requesterID: profileDetails.idNum };
    return responder.Reservation.find(searchQuery).then(function(reservations) {
      console.log('List successful');
      let userReservations = [];
      
      for (const item of reservations) {
        const concatenatedSeats = item.seats.join(', ');
        if (!item.isDeleted) {
          userReservations.push({
            _id: item._id.toString(),
            lab: item.lab,
            seat: concatenatedSeats,
            requestDT: item.requestDT,
            reserveDT: item.reserveDT,
            type: item.type,
            requesterID: item.requesterID,
            requestFor: item.requestFor,
            isDeleted: item.isDeleted
          });
        }
      }
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
        const concatenatedSeats = item.seats.join(', ');
        if (!item.isDeleted) {
          userReservations.push({
            _id: item._id.toString(),
            lab: item.lab,
            seat: concatenatedSeats,
            requestDT: item.requestDT,
            reserveDT: item.reserveDT,
            type: item.type,
            isNotAnonymous: !(item.isAnonymous)
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
  module.exports = {
    handleError: handleError,
    getSearchUsers: getSearchUsers,
    getLabTechReservations: getLabTechReservations,
    getLabTechReservationsByID: getLabTechReservationsByID,
    getStudentReservations: getStudentReservations,
    generateUniqueUserId: generateUniqueUserId,
    generateSeatNumbers: generateSeatNumbers

  };