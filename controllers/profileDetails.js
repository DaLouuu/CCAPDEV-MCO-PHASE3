let profileDetails = {
    firstName: 'silleso',
    lastName: '',
    role: '',
    bio: '',
    email: '',
    idNum: '',
    birthday: '',
    pronouns: '',
    pic: '',
    isPublic: false,
    isLabtech: false,
    isDeleted: false
};
  
function updateProfileDetails(newDetails) {
    //profileDetails = { ...profileDetails, ...newDetails };
    Object.keys(newDetails).forEach(key => {
        if (key in profileDetails) {
            profileDetails[key] = newDetails[key];
        }
    });
}
  
  
module.exports = { updateProfileDetails, profileDetails };
  