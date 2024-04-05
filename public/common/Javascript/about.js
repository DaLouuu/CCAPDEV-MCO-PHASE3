$(document).ready(function() {
    $('#pfp').click(function(event) {
        event.preventDefault();
        $('.profile-popup').toggle();
    });
    
    $(document).click(function(event) {
        if (!$(event.target).closest('.profile-popup').length && !$(event.target).is('#pfp')) {
            $('.profile-popup').hide();
        }
    });
    $('#homeButton').click(function(){
        window.location.href = '/homepage';
    });
    $('#aboutButton').hide()

});