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
            if ($(this).css('backgroundColor') === 'rgb(147, 149, 255)' || $(this).css('backgroundColor') === 'rgb(255, 145, 77)') {
                $(this).css('backgroundColor', '');
            }
        });
        selectedSeats = [];
        updateSelectedSeatsDisplay();
    }

    function reserveSeats() {
        seatElements.each(function() {
            if ($(this).css('backgroundColor') === 'rgb(255, 145, 77)' || $(this).css('backgroundColor') === '#ff914d') {
                $(this).css('backgroundColor', '');
            }
        });

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
    var confirmSeatNum = $('#confirmSeatNum');
    var confirmDate = $('#confirmDate');
    var confirmTime = $('#confirmTime');
    var confirmReservationType = $('#confirmReservationType');
    var confirmReservationType2 = $('#confirmReservationTypeGroupOrSolo');

    reserveBtn.on('click', function() {
        var selectedSeatNum = $('#selectedSeatNum').val();
        var selectedDate = $('#selectedDate').val();
        var selectedTime = $('#selectedTime').val();
        var isAnonymous = $('#anonymous').prop('checked');
        var isSolo = $('#soloReservation').prop('checked');
        var isGroup = $('#groupReservation').prop('checked');

        if (!selectedSeatNum || !selectedDate || !selectedTime || selectedSeatNum === "Please select a Seat") {
            alert("Please complete the reservation form.");
            return;
        }
        if (selectedSeats.length < 2 && $('#groupReservation').is(':checked')) {
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

    var confirmReservationBtn = $('#confirmReservationBtn');
    confirmReservationBtn.on('click', function() {
        alert("Reservation is successful");
        reserveSeats();
        modal.css('display', "none");
    });

    function getTimeText(timeValue) {
        switch (timeValue) {
            /*
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
                return "Unknown Time";*/
            case "900":
                return "9:00 AM - 9:30 AM";
            case "930":
                return "9:30 AM - 10:00 AM";
            case "1000":
                return "10:00 AM - 10:30 AM";
            case "1030":
                return "10:30 AM - 11:00 AM";
            case "1100":
                return "11:00 AM - 11:30 AM";
            case "1130":
                return "11:30 AM - 12:00 PM";
            case "1200":
                return "12:00 PM - 12:30 PM";
            case "1230":
                return "12:30 PM - 1:00 PM";
            case "1300":
                return "1:00 PM - 1:30 PM";
            case "1330":
                return "1:30 PM - 2:00 PM";
            case "1400":
                return "2:00 PM - 2:30 PM";
            case "1430":
                return "2:30 PM - 3:00 PM";
            case "1500":
                return "3:00 PM - 3:30 PM";
            case "1530":
                return "3:30 PM - 4:00 PM";
            default:
                return "Unknown Time";
        }
    }
});
