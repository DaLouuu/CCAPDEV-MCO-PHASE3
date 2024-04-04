const { profileDetails } = require("../../../controllers/profileDetails");

document.addEventListener('DOMContentLoaded', function () {
    const openButton = document.getElementById('quesButton');
    const popupWindow = document.getElementById('popupWindow');
    const closeButton = document.getElementById('closeButton');
    const dimmedBackground = document.getElementById('dimmedBackground');

    var bookingDetails = {
        seatNumber: "A3",
        date: "2024-02-14",
        timeSlot: "1100",
        anonymous: true,
        groupOrSolo: true
    };

    if (bookingDetails.groupOrSolo) {
        document.getElementById("soloReservation").checked = true;
    }
    if (!bookingDetails.groupOrSolo) {
        document.getElementById("groupReservation").checked = true;
    }

    document.getElementById("selectedSeatNum").value = bookingDetails.seatNumber;
    document.getElementById("selectedDate").value = bookingDetails.date;
    document.getElementById("selectedTime").value = bookingDetails.timeSlot;

    if (bookingDetails.anonymous) {
        document.getElementById("anonymous").checked = true;
    }

    openButton.addEventListener('click', function () {
        popupWindow.classList.add('open');
        dimmedBackground.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        popupWindow.classList.remove('open');
        dimmedBackground.style.display = 'none';
    });

    const currentDateElement = document.getElementById('currentDate');
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = currentDate.toLocaleDateString('en-US', options);

    const seatElements = document.querySelectorAll('.seat');
    let selectedSeats = [];

    function clearSelectedSeats() {
        const selectedSeatNumbers = [];
        seatElements.forEach(function (seat) {
            if (seat.style.backgroundColor === 'rgb(147, 149, 255)') {
                seat.style.backgroundColor = '';
            }
        });

        seatElements.forEach(function (seat) {
            if (seat.style.backgroundColor === 'rgb(255, 145, 77)') {
                selectedSeatNumbers.push(seat.querySelector('.seat-id').textContent);
            }
        });

        document.getElementById('selectedSeatNum').value = selectedSeatNumbers.join(',');
        selectedSeats = [];
    }

    function reserveSeats() {
        const seatElements = document.querySelectorAll('.seat');

        seatElements.forEach(function (seat) {
            if (seat.style.backgroundColor === 'rgb(255, 145, 77)') {
                seat.style.backgroundColor = '';
            }
        });

        selectedSeats.forEach(seat => {
            seat.style.backgroundColor = '#ff914d';
        });

        selectedSeats = [];
    }

    document.getElementById("soloReservation").addEventListener('change', function () {
        if (this.checked) {
            clearSelectedSeats();
        }
    });

    document.getElementById("groupReservation").addEventListener('change', function () {
        clearSelectedSeats();
    });

    seatElements.forEach(function (seat) {
        seat.addEventListener('click', function () {
            const seatId = this.querySelector('.seat-id').textContent;
            const seatInput = document.getElementById('selectedSeatNum');

            if (this.style.backgroundColor === 'rgb(246, 154, 160)') {
                alert("This seat is already booked");
                return;
            }
            if (this.style.backgroundColor === 'rgb(255, 145, 77)') {
                alert("This seat is already yours");
                return;
            }

            if (document.getElementById("groupReservation").checked) {
                if (selectedSeats.length >= 5 && !selectedSeats.includes(this)) {
                    alert("You can only select up to 5 seats.");
                    return;
                }

                if (selectedSeats.includes(this)) {
                    selectedSeats = selectedSeats.filter(selected => selected !== this);
                    this.style.backgroundColor = '';
                } else {
                    this.style.backgroundColor = '#9395ff';
                    selectedSeats.push(this);
                }
            }

            if (document.getElementById("soloReservation").checked) {
                selectedSeats.forEach(selectedSeat => {
                    selectedSeat.style.backgroundColor = '';
                });

                selectedSeats = [];

                this.style.backgroundColor = '#9395ff';
                selectedSeats.push(this);
            }

            seatInput.value = selectedSeats.map(seat => seat.querySelector('.seat-id').textContent).join(',');
        });
    });

    let reserveBtn = document.getElementById("reserveBtn");
    let modal = document.getElementById("reservationModal");
    let closeBtn = document.querySelector(".close");
    let confirmSeatNum = document.getElementById("confirmSeatNum");
    let confirmDate = document.getElementById("confirmDate");
    let confirmTime = document.getElementById("confirmTime");
    let confirmReservationType = document.getElementById("confirmReservationType");
    let confirmReservationType2 = document.getElementById("confirmReservationTypeGroupOrSolo");
    let isAnonymous;

    reserveBtn.addEventListener("click", function () {
        let selectedSeatNum = document.getElementById("selectedSeatNum").value;
        let selectedDate = document.getElementById("selectedDate").value;
        let selectedTime = document.getElementById("selectedTime").value;
        if(profileDetails.isLabtech === true) {
            isAnonymous = false;
        } else {
            isAnonymous = document.getElementById("anonymous").checked;
        }
        let isSolo = document.getElementById("soloReservation").checked;
        let isGroup = document.getElementById("groupReservation").checked;

        if (!selectedSeatNum || !selectedDate || !selectedTime) {
            alert("Please complete the reservation form.");
            return;
        }
        if (selectedSeats.length < 2 && (document.getElementById("groupReservation").checked)) {
            alert("You must select at least 2 seats.");
            return;
        }

        confirmSeatNum.textContent = selectedSeatNum;
        confirmDate.textContent = selectedDate;
        confirmTime.textContent = getTimeText(selectedTime);

        if (isAnonymous) {
            confirmReservationType.textContent = "Anonymous";
            confirmReservationBtn.dataset.reservationType = "Anonymous";
        } else {
            confirmReservationType.textContent = "Standard";
            confirmReservationBtn.dataset.reservationType = "Standard";
        }

        if (isSolo) {
            confirmReservationType2.textContent = "Solo";
            confirmReservationBtn.dataset.reservationType2 = "Solo";
        } else {
            confirmReservationType2.textContent = "Group";
            confirmReservationBtn.dataset.reservationType2 = "Group";
        }

        if (isGroup) {
            confirmReservationType2.textContent = "Group";
            confirmReservationBtn.dataset.reservationType2 = "Group";
        } else {
            confirmReservationType2.textContent = "Solo";
            confirmReservationBtn.dataset.reservationType2 = "Solo";
        }

        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    cancelReservationBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    var confirmReservationBtn = document.getElementById("confirmReservationBtn");
    confirmReservationBtn.addEventListener("click", function () {
        var reservationData = {
            seatNumber: document.getElementById("selectedSeatNum").value,
            date: document.getElementById("selectedDate").value,
            timeSlot: document.getElementById("selectedTime").value,
            anonymous: document.getElementById("anonymous").checked,
            groupOrSolo: document.getElementById("soloReservation").checked ? "Solo" : "Group"
        };

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

        $.ajax({
            type: 'POST',
            url: '/update-reservation',
            data: JSON.stringify(updatedResData),
            contentType: 'application/json',
            success: function(data) {
                console.log('Reservation saved successfully');
                alert("Reservation is successful");
                reserveSeats();
                modal.style.display = "none";
                // Redirect to view_reservations.hbs page
                window.location.href = '/view-reservations'; // Redirect to view_reservations.hbs
            },
            error: function(xhr, status, error) {
                console.error('Error saving reservation:', error);
                alert('An error occurred while saving the reservation. Please try again later.');
            }
        });       
        
    });

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

document.getElementById('homeButton').addEventListener('click', function () {
    window.location.href = 'student_homepage.html';
});

document.getElementById('switchButton1').addEventListener('click', function () {
    window.location.href = 'edit_reserve_labtech.html';
});
