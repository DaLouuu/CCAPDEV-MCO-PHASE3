$(document).ready(function () {
    const delProfileButton = $('#delProfileButton');
    const editProfileButton = $('#editProfileButton');
    const popupWindow = $('#popupWindow');
    const closeButton = $('#closeButton');
    const fullNameInput = $('#fullNameInput');
    const usernameInput = $('#usernameInput');
    const emailInput = $('#emailInput');
    const idNumberInput = $('#idNumberInput');
    const courseInput = $('#courseInput');
    const birthdayInput = $('#birthdayInput');
    const pronounsInput = $('#pronounsInput');
    const saveChangesButton = $('#saveChangesButton');
    const dimmedBackground = $('#dimmedBackground');
    const bioInput = $('#bioInput');
    const closeButtonDelete = $('#closeButtonDelete');
    const typeBar = $("#type-bar");
    const activeStat = $('#active-stat');
    const dataTable = $('#dataTable');
    const soloLabel = $('#solo-percent');
    const grpLabel = $('#group-percent');
    const privacyInput = $('#toggleSwitch');

    $('#homeButton').click(function(){
        window.location.href = '/homepage';
    });

    $('#backButton').click(function(){
        history.back();
    });

    

   

   
    var rowCount = $('.table-row').length;
    activeStat.text("You have " + rowCount + " active reservations");
    if (rowCount == 0){
        typeBar.hide();
        soloLabel.hide();
        grpLabel.hide();
        $('#type-ratio-label').hide()
    }
    else{
        $('#type-ratio-label').hide()
        typeBar.show();
        soloLabel.show();
        grpLabel.show();
        updateProgressBar();
    }
    
    $('#saveChangesButton').click(function() {
        var formData = {
            idNum: $('#idNumber').text(),
            firstName: $('#firstNameInput').val(),
            lastName: $('#lastNameInput').val(),
            birthday: $('#birthdayInput').val(),
            pronouns: $('#pronounsInput').val(),
            bio: $('#bioInput').val()
        };

        $.ajax({
            type: 'POST',
            url: '/save-pfp',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(data) {
                console.log('Response data:', data.message);
    
                // reload page
                location.reload();
    
                // Display success message to the user
                alert('Profile edited successfully');
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    });
    $('#editProfilePicButton').click(function() {
        console.log("clicked edit");
        $('#fileInput').click();
       
    });
    $('#fileInput').change(function() {
        var formData = new FormData();
        formData.append('profilePicture', $('#fileInput')[0].files[0]);
        formData.append('id', $('#idNumber').text());
    
        $.ajax({
            url: '/upload-pfp',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data, status) {
                // Handle success response
                console.log('Profile picture uploaded successfully');
                console.log('Response data:', data);
    
                // reload page
                location.reload();
    
                // Display success message to the user
                alert('Profile picture uploaded successfully');
            },
            error: function(xhr, status, error) {
                // Handle error response
                console.error('Error uploading profile picture:', error);
                
                // Display error message to the user
                alert('Error uploading profile picture. Please try again.');
            }
        });
    });
    function updateProgressBar() {
        const soloPercent = getSoloPercent();
        soloLabel.text("Solo: " + soloPercent + "%");
        grpLabel.text("Group: " + (100-soloPercent) + "%");
        typeBar.val(soloPercent).text(soloPercent + '%');
        typeBar.css("background-color", "rgb(247, 175, 247)"); 
          
    }
    function getSwitchValue() {
        var status = privacyInput.is(':checked') ? 'Public' : 'Private';
        return status;
    }
    function getSoloPercent(){
        var soloCount = 0;
        var ratio = 0;
        const rows = dataTable.find('tbody tr');
        rows.each(function() {
            var tableDatas = $(this).find('td');
            if ($(tableDatas[4]).text() === "Solo") {
                soloCount++;
            }
        });
        ratio = (soloCount/rowCount)*100;
        return ratio.toFixed(2);
    }
       
    editProfileButton.click(function () {
        popupWindow.show();
        dimmedBackground.show();
        
        fullNameInput.val($('#fullName').text());
        usernameInput.val($('#username').text());
        emailInput.val($('#email').text());
        idNumberInput.val($('#idNumber').text());
        if(isLabTech()){
            courseInput.val($('#course').text());
        }
       
        birthdayInput.val($('#birthday').text());
        pronounsInput.val($('#pronouns').text());
        bioInput.val($('#bio-text').text());
        if(isLabTech() && $('#account-privacy').text() == "Public Account"){
           privacyInput.prop('checked', true);
        }
        
        const maxLength = parseInt($(bioInput).attr('maxlength'));
        const currentLength = $(bioInput).val().length;
        const remaining = maxLength - currentLength;
        $('#counter').text(`Characters remaining: ${remaining}`);
    });

    delProfileButton.click(function () {
        $('#deletePopup').show();
        dimmedBackground.show();
    });

    closeButton.click(function () {
        $('#deletePopup').hide();
        popupWindow.hide();
        dimmedBackground.hide();
    });

    closeButtonDelete.click(function () {
        $('#deletePopup').hide();
        dimmedBackground.hide();
    });

    bioInput.on('input', function() {
        const maxLength = parseInt($(this).attr('maxlength'));
        const currentLength = $(this).val().length;
        const remaining = maxLength - currentLength;
        $('#counter').text(`Characters remaining: ${remaining}`);
    });
    function isLabTech(){
        return $('#account-type').text()=="Lab Technician";
    }
    saveChangesButton.click(function () {

        $('#fullName').text(fullNameInput.val());
        $('#username').text(usernameInput.val());
        $('#email').text(emailInput.val());
        $('#idNumber').text(idNumberInput.val());
        if(isLabTech()){
            $('#course').text(courseInput.val());
        }
        $('#birthday').text(birthdayInput.val());
        $('#pronouns').text(pronounsInput.val());
        $('#bio-text').text(bioInput.val());
        $('#account-privacy').text(getSwitchValue() + " Account")

        popupWindow.hide();
        dimmedBackground.hide();
    });
    
    privacyInput.change(function() {
        var status = getSwitchValue();
        $('#privacyStatus').text(status);
    });


});