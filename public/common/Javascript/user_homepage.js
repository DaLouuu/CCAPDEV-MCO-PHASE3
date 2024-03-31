$(document).ready(function() {
    $('#viewButton').click(function() {
        window.location.href = '/view-reservations';
    });
  
    $('#reserveButton').click(function() {
        window.location.href = '/choose-lab';
    });

    $('#searchButton').click(function() {
        window.location.href = '/search'; // Redirect to the search page
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

    $('.profile-popup').click(function(event) {
        event.stopPropagation();
    }); 
});
