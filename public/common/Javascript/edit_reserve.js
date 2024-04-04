$(document).ready(function () {
    const openButton = $('#quesButton');
    const popupWindow = $('#popupWindow');
    const closeButton = $('#closeButton');
    const dimmedBackground = $('#dimmedBackground');

    var bookingDetails = {
        seatNumber: "A3",
        date: "2024-02-14",
        timeSlot: "1100",
        anonymous: true,
        groupOrSolo: true
    };

    if (bookingDetails.groupOrSolo) {
        $("#soloReservation").prop('checked', true);
    }
    if (!bookingDetails.groupOrSolo) {
        $("#groupReservation").prop('checked', true);
    }

    $("#selectedSeatNum").val(bookingDetails.seatNumber);
    $("#selectedDate").val(bookingDetails.date);
    $("#selectedTime").val(bookingDetails.timeSlot);

    if (bookingDetails.anonymous) {
        $("#anonymous").prop('checked', true);
    }

    openButton.on('click', function () {
        popupWindow.addClass('open');
        dimmedBackground.css('display', 'block');
    });

    closeButton.on('click', function () {
        popupWindow.removeClass('open');
        dimmedBackground.css('display', 'none');
    });

    const currentDateElement = $('#currentDate');
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.text(currentDate.toLocaleDateString('en-US', options));

    const seatElements = $('.seat');
    let selectedSeats = [];

    function clearSelectedSeats() {
        const selectedSeatNumbers = [];
        seatElements.each(function () {
            if ($(this).css('backgroundColor') === 'rgb(147, 149, 255)') {
                $(this).css('backgroundColor', '');
            }
        });

        seatElements.each(function () {
            if ($(this).css('backgroundColor') === 'rgb(255, 145, 77)') {
                selectedSeatNumbers.push($(this).find('.seat-id').text());
            }
        });

        $("#selectedSeatNum").val(selectedSeatNumbers.join(','));
        selectedSeats = [];
    }

    function reserveSeats() {
        seatElements.each(function () {
            if ($(this).css('backgroundColor') === 'rgb(255, 145, 77)') {
                $(this).css('backgroundColor', '');
            }
        });

        selectedSeats.forEach(function (seat) {
            $(seat).css('backgroundColor', '#ff914d');
        });

        selectedSeats = [];
    }

    $("#soloReservation").on('change', function () {
        if ($(this).prop('checked')) {
            clearSelectedSeats();
        }
    });

    $("#groupReservation").on('change', function () {
        clearSelectedSeats();
    });

    seatElements.each(function () {
        $(this).on('click', function () {
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

            if ($("#groupReservation").prop('checked')) {
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
            }

            if ($("#soloReservation").prop('checked')) {
                selectedSeats.forEach(function (selectedSeat) {
                    $(selectedSeat).css('backgroundColor', '');
                });

                selectedSeats = [];

                $(this).css('backgroundColor', '#9395ff');
                selectedSeats.push(this);
            }

            seatInput.val(selectedSeats.map(seat => $(seat).find('.seat-id').text()).join(','));
        });
    });

    let reserveBtn = $("#reserveBtn");
    let modal = $("#reservationModal");
    let closeBtn = $(".close");
    let confirmSeatNum = $("#confirmSeatNum");
    let confirmDate = $("#confirmDate");
    let confirmTime = $("#confirmTime");
    let confirmReservationType = $("#confirmReservationType");
    let confirmReservationType2 = $("#confirmReservationTypeGroupOrSolo");
    let isAnonymous;

    reserveBtn.on("click", function () {
        let selectedSeatNum = $("#selectedSeatNum").val();
        let selectedDate = $("#selectedDate").val();
        let selectedTime = $("#selectedTime").val();
        if (profileDetails.isLabtech === true) {
            isAnonymous = false;
        } else {
            isAnonymous = $("#anonymous").prop('checked');
        }
        let isSolo = $("#soloReservation").prop('checked');
        let isGroup = $("#groupReservation").prop('checked');

        if (!selectedSeatNum || !selectedDate || !selectedTime) {
            alert("Please complete the reservation form.");
            return;
        }
        if (selectedSeats.length < 2 && ($("#groupReservation").prop('checked'))) {
            alert("You must select at least 2 seats.");
            return;
        }

        confirmSeatNum.text(selectedSeatNum);
        confirmDate.text(selectedDate);
        confirmTime.text(getTimeText(selectedTime));

        if (isAnonymous) {
            confirmReservationType.text("Anonymous");
            confirmReservationBtn.data('reservationType', "Anonymous");
        } else {
            confirmReservationType.text("Standard");
            confirmReservationBtn.data('reservationType', "Standard");
        }

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

        modal.css("display", "block");
    });

    closeBtn.on("click", function () {
        modal.css("display", "none");
    });

    $("#cancelReservationBtn").on("click", function () {
        modal.css("display", "none");
    });

    $(window).on("click", function (event) {
        if (event.target === modal[0]) {
            modal.css("display", "none");
        }
    });

    var confirmReservationBtn = $("#confirmReservationBtn");
    confirmReservationBtn.on("click", function () {
        // Assuming reservationId is already available in your script
        var reservationId = getUrlPathParameter(2); // Assuming the ID is at index 2

        var lab = $('#confirmLabName').text();
        var selectedSeatNum = $('#confirmSeatNum').text();
        var seatsArray = selectedSeatNum.split(', '); // Split the string into an array
        var trimmedSeatsArray = seatsArray.map(seat => seat.trim());
        var selectedDate = $('#confirmDate').text();
        var selectedTime = $('#confirmTime').text();
        var type = $('#confirmReservationTypeGroupOrSolo').text();
        var isAnonymous;

        if (profileDetails.isLabtech === true) {
            isAnonymous = false;
        } else {
            isAnonymous = $('#anonymous').prop('checked'); 
        }
        var requesterID = $('#confirmStudentID').text();
        var requestFor = $('#confirmStudentID').text();

        var currentDate = new Date();
        var requestDT = formatDateTime(currentDate);

        var reserveDT = selectedDate + ' ' + selectedTime;

        var updatedResData = {
            lab: lab,
            seats: selectedSeatNum,
            requestDT: requestDT,
            reserveDT: reserveDT,
            type: type,
            requesterID: requesterID,
            requestFor: requestFor,
            isAnonymous: isAnonymous,
            isDeleted: false
        };

        console.log("Reservation ID:", reservationId);

        $.ajax({
            type: 'POST',
            url: '/update-reservation/' + reservationId, // Include reservationId in the URL
            data: JSON.stringify(updatedResData),
            contentType: 'application/json',
            success: function(data) {
                console.log('Response data:', data.message);
                alert("Reservation is successful, reservationId:" + reservationId);
                reserveSeats();
                // modal.css("display", "none");
                // Redirect to view_reservations.hbs page
                window.location.href = '/view-reservations'; // Redirect to view_reservations.hbs
            },
            error: function(xhr, status, error) {
                console.error('Error saving reservation:', error);
                alert('An error occurred while saving the reservation. Please try again later.');
            }
        });       
    });

    function getUrlPathParameter(index) {
        var path = window.location.pathname.split('/');
        console.log("Path:", window.location.pathname); // Log the entire URL path
        console.log("Path array:", path); // Log the path array
        return path[index];
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

$('#homeButton').on('click', function () {
    window.location.href = 'student_homepage.html';
});

$('#switchButton1').on('click', function () {
    window.location.href = 'edit_reserve_labtech.html';
});
