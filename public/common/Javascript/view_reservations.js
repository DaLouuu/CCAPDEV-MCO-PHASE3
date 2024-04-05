
$(document).ready(function() {
    const homeButton = $('#homeButton');
    const profileButton = $('#pfp');
    const filterInput = $('#filterInput');
    const filterButton = $('#filterButton');
    const dataTable = $('#dataTable');
    const aboutButton = $('#aboutButton');
    const aboutWindow = $('#aboutWindow');
    const closeAbout = $('#closeAbout');
    const dimmedBackground = $('#dimmedBackground');
    const reservationWindow = $('#resWindow');
    const closeRes = $('#closeRes');
    const closeButtonDelete = $('#closeButtonDelete');
    const delReservation = $('#delete-res');
    const studentId = $('#student-id');
    aboutWindow.hide();
    dimmedBackground.hide();
    reservationWindow.hide();

    // Function to calculate the time difference in minutes between two time strings
    function calculateTimeDifference(startTime, endTime) {
        var start = new Date(startTime);
        var end = new Date(endTime);
        var difference = Math.abs(end - start);
        return Math.floor((difference / 1000) / 60); // Convert milliseconds to minutes
    }

    // Function to check if the reservation can be deleted
    function canDeleteReservation(reserveDT) {
        var reservationTimes = reserveDT.split(" - ");
        var startTime = new Date(reservationTimes[0].trim()); // Extract and convert start time from reserveDT to Date object
        var currentTime = new Date(); // Current date and time

        // Calculate the time difference in minutes
        var timeDifference = calculateTimeDifference(currentTime, startTime);

        return timeDifference < 10; // Return true if the difference is less than 10 minutes
    }

    // Check if the reservation can be deleted and show/hide delete button accordingly
    var reserveDT = reservations.reserveDT; // Example reserveDT
    if (canDeleteReservation(reserveDT)) {
        delReservation.show(); // Show the delete reservation button
    } else {
        delReservation.hide(); // Hide the delete reservation button
    }

    delReservation.click(function () {
        reservationWindow.hide();
        $('#deletePopup').show();
        dimmedBackground.show();
    });

    // Function to handle delete reservation button click
    delReservation.click(function () {
        reservationWindow.hide();
        $('#deletePopup').show();
        dimmedBackground.show();
    });

    closeButtonDelete.click(function () {
        $('#deletePopup').hide();
        dimmedBackground.hide();
    });
    
    homeButton.click(function(){
        window.location.href = '/homepage';
    });
    studentId.click(function() {
        const userId = $(this).text(); 
        //TO DO: GET SUBSTRING AFTER SPACE
        // Find the position of the second space
        let secondSpaceIndex = userId.indexOf(' ', userId.indexOf(' ') + 1);
        let substringAfterSecondSpace = userId.substring(secondSpaceIndex + 1);
        window.location.href = '/findUser_id/' + substringAfterSecondSpace;
    });
    profileButton.click(function() {
        $('.profile-popup').toggle();
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.profile-popup').length && !$(event.target).is('#pfp')) {
            $('.profile-popup').hide();
        }
    });
   
    $('.table-row').click(function(){
        getReservationDetails($(this));
        reservationWindow.show();
        dimmedBackground.show();
    });

    closeRes.click(function(){
        reservationWindow.hide();
        dimmedBackground.hide();
    });

    aboutButton.click(function(){
        aboutWindow.show();
        dimmedBackground.show();
    });

    closeAbout.click(function(){
        aboutWindow.hide();
        dimmedBackground.hide();
    });

    filterButton.click(function(){
        filterTable();
    });

    function getReservationDetails(trElement){
        const type = $('#res-type');
        const lab = $('#laboratory');
        const seat = $('#seat-num');
        const reqDate = $('#req-date');
        const resDate = $('#res-date');
        const tableDatas = trElement.find('td');
        
        type.html('<b>Reservation Type: </b>' + $(tableDatas[4]).text());
        lab.html('<b>Laboratory Number: </b>' + $(tableDatas[0]).text());
        seat.html('<b>Seat Number: </b>' + $(tableDatas[1]).text());
        reqDate.html('<b>Date and Time of Request: </b>' + $(tableDatas[2]).text());
        resDate.html('<b>Date and Time of Reservation: </b>' + $(tableDatas[3]).text());
        if(tableDatas.length == 8){
            studentId.html('<b>Student ID: </b>' + $(tableDatas[5]).text());
            $('#res-id').html('<b>Reservation ID: </b>' + $(tableDatas[6]).text());
            $('#res-status').html('<b>Reservation Status: </b>' + $(tableDatas[7]).text());
            
        }

    }
    
    function filterTable() {
        const filterValue = filterInput.val().toUpperCase();
        const rows = dataTable.find('tbody tr');

        rows.each(function() {
            const columns = $(this).find('td');
            let found = false;
        
            columns.each(function() {
                const cellText = $(this).text();
        
                if (cellText.toUpperCase().indexOf(filterValue) > -1) {
                    found = true;
                    return false; 
                }
            });
        
            if (found) {
                $(this).show(); 
            } else {
                $(this).hide(); 
            }
        });
    }
    $('#choiceForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission

        // Check if the user has selected to delete the reservation
        const choice = $('input[name="choice"]:checked').val();
        if (choice === 'yes') {
            const reservationId = $('#res-id').text(); 
            let secondSpaceIndex = reservationId.indexOf(' ', reservationId.indexOf(' ') + 1);
            let substringAfterSecondSpace = reservationId.substring(secondSpaceIndex + 1);
            const url = `/delete-reservation/${substringAfterSecondSpace}`;

            // Send AJAX request to delete reservation
            $.ajax({
                type: 'PUT',
                url: url,
                success: function(response) {
                    closeButtonDelete.trigger('click');
                    window.alert("Reservation successfully deleted.");
                    location.reload();
                },
                error: function(xhr, status, error) {
                    alert('Error, try again later.');
                }
            });
        } else {
            closeButtonDelete.trigger('click');
        }
    });
    

$('button[id^="edit-res"]').click(function() {
    // Get the reservation ID from the corresponding table cell
    let reservationId = $('#res-id').text();
    let secondSpaceIndex = reservationId.indexOf(' ', reservationId.indexOf(' ') + 1);
    let substringAfterSecondSpace = reservationId.substring(secondSpaceIndex + 1);

    // Redirect to the edit reservation page with the reservation ID
    window.location.href = '/edit_reserve/' + substringAfterSecondSpace;
});
    $('#present-res').click(function(){
        const reservationId = $('#res-id').text(); 
        let secondSpaceIndex = reservationId.indexOf(' ', reservationId.indexOf(' ') + 1);
        let substringAfterSecondSpace = reservationId.substring(secondSpaceIndex + 1);
        $.ajax({
            type: 'POST',
            url: '/update-res-status', // Specify the URL of your server-side route
            data: {
                _id: substringAfterSecondSpace
            },
            success: function(response) {
                console.log('Success:', response);
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });

    
});
