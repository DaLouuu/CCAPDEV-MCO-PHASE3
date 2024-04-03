const aboutButton = $('#aboutButton');
const aboutWindow = $('#aboutWindow');
const closeAbout = $('#closeAbout');
const dimmedBackground = $('#dimmedBackground');

aboutWindow.hide();
dimmedBackground.hide();
$(document).ready(function() {
    $('#left-arrow').on('click', function() {
        var labChoices = ['GK303','GK304', 'GK305', 'GK306A', 'GK306B'];
        console.log("Left arrow clicked");
        var chosenLab = $('#lab-text').text();
        const images = ['/common/CSS & Assets/Assets/lab-1.jpg','/common/CSS & Assets/Assets/lab-1.jpg', '/common/CSS & Assets/Assets/lab-2.jpg', '/common/CSS & Assets/Assets/lab-3.jpg', '/common/CSS & Assets/Assets/lab-4.jpg'];
        var currentIndex = labChoices.indexOf(chosenLab);
    
        if (currentIndex !== -1) {
            var newIndex = (currentIndex + labChoices.length - 1) % labChoices.length;
            $('#lab-text').text(labChoices[newIndex]);
            $('#lab-img').attr('src', images[newIndex]);
            changePage(newIndex);
        }
    });
    
    $('#right-arrow').on('click', function() {
        var labChoices = ['GK303','GK304', 'GK305', 'GK306A', 'GK306B'];
        console.log("Right arrow clicked");
        var chosenLab = $('#lab-text').text();
        const images = ['/common/CSS & Assets/Assets/lab-1.jpg','/common/CSS & Assets/Assets/lab-1.jpg', '/common/CSS & Assets/Assets/lab-2.jpg', '/common/CSS & Assets/Assets/lab-3.jpg', '/common/CSS & Assets/Assets/lab-4.jpg'];
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
