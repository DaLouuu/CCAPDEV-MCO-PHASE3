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
    
    
    $('#editProfilePicButton').click(function() {
        $('#fileInput').click();
    });
    $('#fileInput').change(function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#profile-picture').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
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


    $('#choiceForm').submit(function (event) {
        event.preventDefault();

        var choice = $('input[name="choice"]:checked').val();

        if (choice === "yes") {
            
            window.location.href = 'login.html';
            window.alert("Account successfully deleted. You will be redirected to the login page.");
        }
        else if (choice === "no"){
            closeButtonDelete.trigger('click');
        }
    });

});
