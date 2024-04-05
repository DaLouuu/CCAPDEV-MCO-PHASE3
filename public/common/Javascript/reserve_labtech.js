
$(document).ready(function() {
   
    const currentDateElement = $('#currentDate');
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.text(currentDate.toLocaleDateString('en-US', options));

    const seatElements = $('.seat');
    let selectedSeats = [];

    const openButton = $('#quesButton');
    const popupWindow = $('#popupWindow');
    const closeButton = $('#closeButton');
    const dimmedBackground = $('#dimmedBackground');
    const homeButton = $('#homeButton');

    homeButton.on('click', function () {
        window.location.href = '/homepage';
    });

    openButton.on('click', function () {
        popupWindow.addClass('open');
        dimmedBackground.css('display', 'block');
    });

    closeButton.on('click', function () {
        popupWindow.removeClass('open');
        dimmedBackground.css('display', 'none');
    });

    function updateSelectedSeatsDisplay() {
        const seatInput = $('#selectedSeatNum');
        if (selectedSeats.length === 0) {
            seatInput.val("Please select a Seat");
        } else {
            const selectedSeatNumbers = selectedSeats.map(seat => $(seat).find('.seat-id').text());
            seatInput.val(selectedSeatNumbers.join(', '));
        }
    }

    updateSelectedSeatsDisplay();

    function clearSelectedSeats() {
        seatElements.each(function() {
            if ($(this).css('backgroundColor') === 'rgb(147, 149, 255)') {
                $(this).css('backgroundColor', '');
            }
        });
        selectedSeats = [];
        updateSelectedSeatsDisplay();
    }

    function reserveSeats() {

        selectedSeats.forEach(function(seat) {
            $(seat).css('backgroundColor', '#ff914d');
        });

        selectedSeats = [];
    }

    $('#soloReservation').on('change', clearSelectedSeats);
    $('#groupReservation').on('change', clearSelectedSeats);

    seatElements.on('click', function() {
        const seatId = $(this).find('.seat-id').text();
        const seatInput = $('#selectedSeatNum');

        if ($(this).css('backgroundColor') === 'rgb(246, 154, 160)') {
            alert("This seat is already booked");
            return;
        }
        if ($(this).css('backgroundColor') === 'rgb(255, 145, 77)') {
            alert("This seat is already yours");
            return;
        }

        if ($('#groupReservation').is(':checked')) {
            if (selectedSeats.length >= 5 && !selectedSeats.includes(this)) {
                alert("You can only select up to 5 seats.");
                return;
            }

            if (selectedSeats.includes(this)) {
                selectedSeats = selectedSeats.filter(selected => selected !== this);
                $(this).css('backgroundColor', '');
            } else {
                $(this).css('backgroundColor', '#9395ff');
                selectedSeats.push(this);
            }
        } else if ($('#soloReservation').is(':checked')) {
            selectedSeats.forEach(function(selectedSeat) {
                $(selectedSeat).css('backgroundColor', '');
            });

            selectedSeats = [];

            $(this).css('backgroundColor', '#9395ff');
            selectedSeats.push(this);
        }

        seatInput.val(selectedSeats.map(seat => $(seat).find('.seat-id').text()).join(', '));
        updateSelectedSeatsDisplay();
    });


    var reserveBtn = $('#reserveBtn');
    var modal = $('#reservationModal');
    var closeBtn = $('.close');
    var confirmStudentID = $('#confirmStudentID');
    var confirmSeatNum = $('#confirmSeatNum');
    var confirmDate = $('#confirmDate');
    var confirmTime = $('#confirmTime');
    var confirmReservationType2 = $('#confirmReservationTypeGroupOrSolo');

    reserveBtn.on('click', function() {
        var selectedStudentID = $('#selectedStudentID').val();
        var selectedSeatNum = $('#selectedSeatNum').val();
        var selectedDate = $('#selectedDate').val();
        var selectedTime = $('#selectedTime').val();
        var isSolo = $('#soloReservation').prop('checked');
        var isGroup = $('#groupReservation').prop('checked');

        if (!selectedStudentID || !selectedSeatNum || !selectedDate || !selectedTime) {
            alert("Please complete the reservation form.");
            return;
        }
        if (selectedSeats.length < 2 && $('#groupReservation').prop('checked')) {
            alert("You must select at least 2 seats.");
            return;
        }

        confirmStudentID.text(selectedStudentID);
        confirmSeatNum.text(selectedSeatNum);
        confirmDate.text(selectedDate);
        confirmTime.text(getTimeText(selectedTime));

        if (isSolo) {
            confirmReservationType2.text("Solo");
            confirmReservationBtn.data('reservationType2', "Solo");
        } else {
            confirmReservationType2.text("Group");
            confirmReservationBtn.data('reservationType2', "Group");
        }

        if (isGroup) {
            confirmReservationType2.text("Group");
            confirmReservationBtn.data('reservationType2', "Group");
        } else {
            confirmReservationType2.text("Solo");
            confirmReservationBtn.data('reservationType2', "Solo");
        }

        modal.css('display', "block");
    });

    closeBtn.on('click', function() {
        modal.css('display', "none");
    });

    $('#cancelReservationBtn').on('click', function() {
        modal.css('display', "none");
    });

    $(window).on('click', function(event) {
        if ($(event.target).is(modal)) {
            modal.css('display', "none");
        }
    });

    

// Call the checkReservations function when the date or time changes
$('#selectedDate, #selectedTime').change(function() {
    const selectedLab = $('#confirmLabName').text(); // Get selected lab from frontend
    const selectedDate = $('#selectedDate').val(); // Get selected date from frontend
    const selectedTimeValue = $('#selectedTime').val(); // Get the value of the selected time from frontend
    const selectedTime = getTimeText(selectedTimeValue);
    const currentRequesterID =  $('#confirmStudentID').text();;
    checkReservations(selectedLab, selectedDate, selectedTime,currentRequesterID);
});

// AJAX request to check reservations and update seat colors
function checkReservations(lab, date, time, currentRequesterID) {
    $.ajax({
        type: 'GET',
        url: '/checkReservations',
        data: {
            lab: lab,
            date: date,
            time: time,
            currentRequesterID: currentRequesterID
        },
        success: function(data) {
            console.log('Updating the Seats');
            console.log('Detected Reservations:', data.reservedSeats);
            console.log('Reservation Requester IDs:', data.reservationRequesterIDs);
            updateSeatColors(data.reservedSeats, data.reservationRequesterIDs, currentRequesterID);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function updateSeatColors(reservedSeats, isCurrentRequester) {
    console.log('isCurrentRequester:', isCurrentRequester);
    console.log('Updating seat colors with reserved seats:', reservedSeats);
    const currentRequesterID =  $('#confirmLabtechID').text();;
    const isCurrentRQ = isCurrentRequester.includes(currentRequesterID);
    $('.seat').each(function() {
        const seatId = $(this).find('.seat-id').text().trim(); // Remove the prefix
  
        if (reservedSeats.includes(seatId)) {
            console.log('Seat', seatId, 'is reserved.');
            if (isCurrentRQ) {
                console.log('Reservation made by current user.');
                $(this).css('background-color', '#ff914d'); // Orange color for current user's reservations
            } else {
                $(this).css('background-color', '#f69aa0'); // Reserved color (e.g., red)
            }
        } else {
            $(this).css('background-color', '#5cb485'); // Available color (e.g., green)
        }
    });
}
var confirmReservationBtn = $('#confirmReservationBtn');
confirmReservationBtn.on('click', function() {
    
    var lab = $('#confirmLabName').text();
    var selectedSeatNum = $('#confirmSeatNum').text();
    var seatsArray = selectedSeatNum.split(', '); // Split the string into an array
    var trimmedSeatsArray = seatsArray.map(seat => seat.trim());
    var selectedDate = $('#confirmDate').text();
    var selectedTime = $('#confirmTime').text();
    var type = $('#confirmReservationTypeGroupOrSolo').text();
    var requesterID = $('#confirmLabtechID').text();
    var requestFor = $('#confirmStudentID').text();

    var currentDate = new Date();
    var requestDT = formatDateTime(currentDate);

    var reserveDT = selectedDate + ' ' + selectedTime;

  
    
    var reservationData = {
        lab: lab,
        seats: trimmedSeatsArray, 
        requestDT: requestDT,
        reserveDT: reserveDT,
        type: type, 
        requesterID: requesterID,
        requestFor: requestFor,
        isAnonymous: false,
        isDeleted: false
    };

    
    $.ajax({
        url: "/create-reservation",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(reservationData),
        success: function(response) {
            console.log("Reservation saved successfully.");
            alert("Reservation is successful");
            reserveSeats();
            modal.css('display', "none");
        },
        error: function(xhr, status, error) {
            console.error("Error saving reservation:", error);
        }
    });
});

    
function formatDateTime(date) {
    // Get the components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if month is single digit
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day is single digit
    const hours = String(date.getHours()).padStart(2, '0'); // Add leading zero if hour is single digit
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero if minute is single digit

    // Determine AM/PM
    const meridiem = (hours < 12) ? 'AM' : 'PM';

    // Convert hours from 24-hour to 12-hour format
    const formattedHours = (hours % 12 === 0) ? 12 : hours % 12;

    // Concatenate the components with dashes and colons to form the desired format
    const formattedDateTime = `${year}-${month}-${day} ${formattedHours}:${minutes} ${meridiem}`;

    return formattedDateTime;
}


    function getTimeText(timeValue) {
        switch (timeValue) {
            case "7000":
                return "07:30 AM - 09:00 AM";
            case "9000":
                return "09:15 AM - 10:45 AM";
            case "1100":
                return "11:00 AM - 12:30 PM";
            case "1200":
                return "12:45 PM - 02:15 PM";
            case "1400":
                return "02:30 PM - 04:00 PM ";
            case "1600":
                return "04:15 PM - 05:45 PM";
            default:
                return "Unknown Time";
        }
    }
});

