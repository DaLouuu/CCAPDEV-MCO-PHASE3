const mongoose = require('mongoose');

//collection schema
  const loginSchema = new mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'labtech'], required: true },
  }, { versionKey: false });
  
  const profileSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String },
    bio: { type: String },
    email: { type: String },
    idNum: { type: String },
    birthday: { type: String },
    pronouns: { type: String },
    pic: {type: String},
    isPublic: { type: Boolean },
    isLabtech: { type: Boolean },
    isDeleted: { type: Boolean }
  },{ versionKey: false });
  
  const reservationSchema = new mongoose.Schema({
    lab: { type: String },
    seats: { type: [ String ] },
    requestDT: { type: String },
    reserveDT: { type: String },
    type: { type: String },
    requesterID: { type: String },
    requestFor: {type: String},
    isAnonymous: {type: Boolean},
    isDeleted: { type: Boolean },
  },{ versionKey: false });
  
  const labSchema = new mongoose.Schema({
    labIndex: { type: String },
    labName: { type: String },
    columns: { type: Number },
    img: {type: String}
  },{ versionKey: false });
  
  const searchSchema = new mongoose.Schema({
    name: { type: String },
    role: { type: String },
    idNumber: { type: String },
    status: { type: String },
}, { versionKey: false });
  
  //create a collection and name it as a model
  module.exports.Login = mongoose.model('login', loginSchema);
  module.exports.Profile = mongoose.model('profile', profileSchema);
  module.exports.Reservation = mongoose.model('reservation', reservationSchema);
  module.exports.Lab = mongoose.model('lab', labSchema);
  module.exports.Search = mongoose.model('search', searchSchema);