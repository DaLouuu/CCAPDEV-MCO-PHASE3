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
        window.location.href = 'student_user.html';
    });
    profileButton.click(function() {
        $('.profile-popup').show();
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
        if(tableDatas.length == 6){
            studentId.html('<b>Student ID: </b>' + $(tableDatas[5]).text());
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

    $('#choiceForm').submit(function (event) {
        event.preventDefault();
        var choice = $('input[name="choice"]:checked').val();

        if (choice === "yes") {
            closeButtonDelete.trigger('click');
            window.alert("Reservation successfully deleted.");
        }
        else if (choice === "no"){
            closeButtonDelete.trigger('click');
        }
    });

    $('#edit-res').click(function(){
        window.location.href = '/edit_reserve';
    });


    
});
