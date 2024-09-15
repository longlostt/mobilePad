const handleFormSubmit = (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    // Reset error messages
    resetErrorMessages();

    let valid = true;

    // Check if fields are filled
    if (!username) {
        document.getElementById('userLength').innerText = 'Username is required!';
        document.getElementById('userLength').style.display = 'block';
        valid = false;
    } else if (username.length < 8) {
        document.getElementById('userLength').innerText = 'Username must be at least 8 characters long!';
        document.getElementById('userLength').style.display = 'block';
        valid = false;
    }

    if (!password) {
        document.getElementById('passLength').innerText = 'Password is required!';
        document.getElementById('passLength').style.display = 'block';
        valid = false;
    } else {
        // Password validation
        if (password.length < 8) {
            document.getElementById('passLength').innerText = 'Password must be at least 8 characters long!';
            document.getElementById('passLength').style.display = 'block';
            valid = false;
        }
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            document.getElementById('char').innerText = 'Password must contain a special character!';
            document.getElementById('char').style.display = 'block';
            valid = false;
        }
        if (!/[a-zA-Z]/.test(password)) {
            document.getElementById('letter').innerText = 'Password must contain at least one letter!';
            document.getElementById('letter').style.display = 'block';
            valid = false;
        }
        if (!/[0-9]/.test(password)) {
            document.getElementById('number').innerText = 'Password must contain at least one number!';
            document.getElementById('number').style.display = 'block';
            valid = false;
        }
    }

    if (!passwordConfirm) {
        document.getElementById('notMatch').innerText = 'Please confirm your password!';
        document.getElementById('notMatch').style.display = 'block';
        valid = false;
    } else if (password !== passwordConfirm) {
        document.getElementById('notMatch').innerText = 'Passwords do not match!';
        document.getElementById('notMatch').style.display = 'block';
        valid = false;
    }

    // Submit form if everything is valid
    if (valid) {
        document.getElementById('signupForm').submit();
    }

    // document.getElementById('signupForm').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     document.getElementById('signUp').disabled = true;
    // });
    // that dont work for some reason.
};

const resetErrorMessages =  () => {
    const errorMessages = document.querySelectorAll('.errMessage');
    errorMessages.forEach(message => message.style.display = 'none');
};


document.getElementById('signUp').addEventListener('click', handleFormSubmit);
