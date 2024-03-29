document.addEventListener('DOMContentLoaded', function () {
    const openButton = document.getElementById('quesButton');
    const popupWindow = document.getElementById('popupWindow');
    const closeButton = document.getElementById('closeButton');
    const dimmedBackground = document.getElementById('dimmedBackground');

    var bookingDetails = { studentID: "12345678", seatNumber: "A3", date: "2024-02-14", timeSlot: "1100", groupOrSolo: true };

    if (bookingDetails.groupOrSolo) {
        document.getElementById("soloReservation").checked = true;
    } else {
        document.getElementById("groupReservation").checked = true;
    }

    document.getElementById("selectedStudentID").value = bookingDetails.studentID;
    document.getElementById("selectedSeatNum").value = bookingDetails.seatNumber;
    document.getElementById("selectedDate").value = bookingDetails.date;
    document.getElementById("selectedTime").value = bookingDetails.timeSlot;

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

    let selectedSeats = [];

    function clearSelectedSeats() {
        const seatElements = document.querySelectorAll('.seat');
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

    const seatElements = document.querySelectorAll('.seat');

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

    var reserveBtn = document.getElementById("reserveBtn");
    var modal = document.getElementById("reservationModal");
    var closeBtn = document.querySelector(".close");
    var confirmStudentID = document.getElementById("confirmStudentID");
    var confirmSeatNum = document.getElementById("confirmSeatNum");
    var confirmDate = document.getElementById("confirmDate");
    var confirmTime = document.getElementById("confirmTime");
    var confirmReservationType2 = document.getElementById("confirmReservationTypeGroupOrSolo");

    reserveBtn.addEventListener("click", function () {
        var selectedStudentID = document.getElementById("selectedStudentID").value;
        var selectedSeatNum = document.getElementById("selectedSeatNum").value;
        var selectedDate = document.getElementById("selectedDate").value;
        var selectedTime = document.getElementById("selectedTime").value;
        var isSolo = document.getElementById("soloReservation").checked;
        var isGroup = document.getElementById("groupReservation").checked;

        if (!selectedStudentID || !selectedSeatNum || !selectedDate || !selectedTime) {
            alert("Please complete the reservation form.");
            return;
        }
        if (selectedSeats.length < 2 && (document.getElementById("groupReservation").checked)) {
            alert("You must select at least 2 seats.");
            return;
        }

        confirmStudentID.textContent = selectedStudentID;
        confirmSeatNum.textContent = selectedSeatNum;
        confirmDate.textContent = selectedDate;
        confirmTime.textContent = getTimeText(selectedTime);

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
        alert("Reservation is successful");
        reserveSeats();
        modal.style.display = "none";
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
    window.location.href = 'labtech_homepage.html';
});

document.getElementById('switchButton1').addEventListener('click', function () {
    window.location.href = 'edit_reserve.html';
});

