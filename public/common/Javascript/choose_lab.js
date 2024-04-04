const aboutButton = $('#aboutButton');
const aboutWindow = $('#aboutWindow');
const closeAbout = $('#closeAbout');
const dimmedBackground = $('#dimmedBackground');
let labChoices = [];
let columns = [];
let images = [];
aboutWindow.hide();
dimmedBackground.hide();
$(document).ready(function() {
    $.ajax({
        url: '/getLabDetails',
        method: 'GET',
        success: function(response) {
            let labDetails = response.labDetails; // Array of lab details objects [{ labName: '...', columns: ... }, ...]
            
            // Populate lab choices and images dynamically
            labChoices = labDetails.map(function(lab) {
                return lab.labName;
            });
            columns = labDetails.map(function(lab) {
                return lab.columns;
            });
            images = labDetails.map(function(lab) {
                return lab.img;
            });
            console.log("labs: " + labChoices);
            console.log("columns: " + columns);
            // Update UI with initial lab details
            $('#lab-text').text(labChoices[0]);
            // Update other UI elements as needed
        },
        error: function(xhr, status, error) {
            console.error('Error fetching lab details:', error);
        }
    });
    $('#left-arrow').on('click', function() {
        var chosenLab = $('#lab-text').text();
        var currentIndex = labChoices.indexOf(chosenLab);
    
        if (currentIndex !== -1) {
            var newIndex = (currentIndex + labChoices.length - 1) % labChoices.length;
            $('#lab-text').text(labChoices[newIndex]);
            $('#lab-img').attr('src', images[newIndex]);
            changePage(newIndex);
        }
    });
    
    $('#right-arrow').on('click', function() {
        var chosenLab = $('#lab-text').text();
        var currentIndex = labChoices.indexOf(chosenLab);
    
        if (currentIndex !== -1) {
            var newIndex = (currentIndex + 1) % labChoices.length;
            $('#lab-text').text(labChoices[newIndex]);
            $('#lab-img').attr('src', images[newIndex]);
            changePage(newIndex);
        }
    });
    
    function changePage(index) {
        var pageName = '/reserve?lab=' + index; // Change 'index' to 'lab'
        $('#lab-page').attr('href', pageName);
    }
    
    
        $('#homeButton').click(function(){
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
    
    $('.profile-popup').click(function(event) {
        event.stopPropagation();
    });
    
    aboutButton.click(function(){
        aboutWindow.show();
        dimmedBackground.show();
    });
    
    closeAbout.click(function(){
        aboutWindow.hide();
        dimmedBackground.hide();
    });
});