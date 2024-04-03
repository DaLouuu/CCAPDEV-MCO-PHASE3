$(document).ready(function() {
    const homeButton = $('#homeButton');
    const profileButton = $('#pfp');
    const filterInput = $('#filterInput');
    const filterButton = $('#filterButton');
    const dataTable = $('#dataTable');
    const aboutButton = $('#aboutButton');
    const aboutWindow = $('#aboutWindow');
    const closeAbout = $('#closeAbout');
    const dimmedBackground = $('#dimmedBackground');
    aboutWindow.hide();
    dimmedBackground.hide();

    
    homeButton.click(function(){
        window.location.href = '/homepage';
    });
    profileButton.click(function() {
        $('.profile-popup').toggle();
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.profile-popup').length && !$(event.target).is('#pfp')) {
            $('.profile-popup').hide();
        }
    });

    $('.table-row').click(function(){
        // Retrieve the user ID from the clicked row
        const userId = $(this).find('.user-id').text(); // Assuming you have a hidden element with class 'user-id' containing the user ID
    
        // Redirect to the user page with the user ID as a query parameter
        window.location.href = '/user?id=' + userId;
    });
    

    aboutButton.click(function(){
        aboutWindow.show();
        dimmedBackground.show();
    });

    closeAbout.click(function(){
        aboutWindow.hide();
        dimmedBackground.hide();
    });

    filterButton.click(function(){
        filterTable();
    });
    
    function filterTable() {
        const filterValue = filterInput.val().toUpperCase();
        const rows = dataTable.find('tbody tr');

        rows.each(function() {
            const columns = $(this).find('td');
            let found = false;
        
            columns.each(function() {
                const cellText = $(this).text();
        
                if (cellText.toUpperCase().indexOf(filterValue) > -1) {
                    found = true;
                    return false; 
                }
            });
        
            if (found) {
                $(this).show(); 
            } else {
                $(this).hide(); 
            }
        });
    }


    
});
