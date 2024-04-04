document.getElementById('signup-button').addEventListener('click', function (event) {
    event.preventDefault();

    var email = document.querySelector('.signup-email').value;
    var password = document.querySelector('.signup-password').value;
    var confirmPassword = document.querySelector('.confirm-password').value;

    if (email === '' || password === '' || confirmPassword === '') {
        alert('Please fill in all the fields.');
    } else if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
    } else {
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Role:', document.querySelector('input[name="choice"]:checked').value);

        window.location.href = 'login.html';
        alert("Account successfully created. You will be redirected to the login page.");
    }
});
