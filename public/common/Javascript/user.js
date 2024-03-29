$(document).ready(function () {
    const homeButton = $('#homeButton');
    const backButton = $('#backButton');
    const typeBar = $("#type-bar");
    const activeStat = $('#active-stat');
    const dataTable = $('#dataTable');
    const soloLabel = $('#solo-percent');
    const grpLabel = $('#group-percent');

    // Common functions for all users
    homeButton.click(function(){
        window.location.href = '/homepage';
    });

    $('#pfp').click(function(event) {
        event.preventDefault();
        $('.profile-popup').toggle();
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.profile-popup').length && !$(event.target).is('#pfp')) {
            $('.profile-popup').hide();
        }
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
    
    $('.profile-popup').click(function(event) {
        event.stopPropagation();
    });

    backButton.click(function(){
        history.back();
    });

    // Functions specific to users with reservations
    if (activeStat.length > 0) {
        var rowCount = $('.table-row').length;
        activeStat.text("You have " + rowCount + " active reservations");
        updateProgressBar();
    }

    function updateProgressBar() {
        const soloPercent = getSoloPercent();
        soloLabel.text("Solo: " + soloPercent + "%");
        grpLabel.text("Group: " + (100 - soloPercent) + "%");
        typeBar.val(soloPercent).text(soloPercent + '%');
        typeBar.css("background-color", "rgb(247, 175, 247)");
    }

    function getSoloPercent() {
        var soloCount = 0;
        var ratio = 0;
        const rows = dataTable.find('tbody tr');
        rows.each(function() {
            var tableDatas = $(this).find('td');
            if ($(tableDatas[4]).text() === "Solo") {
                soloCount++;
            }
        });
        ratio = (soloCount / rowCount) * 100;
        return ratio.toFixed(2);
    }
});
