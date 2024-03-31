document.getElementById('pfp').addEventListener('click', function(event) {
    event.preventDefault();
    
    var profilePopup = document.querySelector('.profile-popup');
    if (profilePopup.style.display === 'none') {
        profilePopup.style.display = 'block';
    } else {
        profilePopup.style.display = 'none';
    }
});

document.addEventListener('click', function(event) {
    var profilePopup = document.querySelector('.profile-popup');
    if (!profilePopup.contains(event.target) && event.target !== document.getElementById('pfp')) {
        profilePopup.style.display = 'none';
    }
});

document.querySelector('.profile-popup').addEventListener('click', function(event) {
    event.stopPropagation();
});
