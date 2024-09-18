document.addEventListener('DOMContentLoaded', () => {
    const handleFormSubmit = (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const passwordConfirmInput = document.getElementById('passwordConfirm');
        
        const username = usernameInput.value;
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        // Clear previous errors
        resetErrorMessages();

        let valid = true;
        const errors = [];

        // Check if fields are filled and valid
        if (!username) {
            errors.push({ message: 'Username is required!' });
            valid = false;
        } else if (username.length < 8) {
            errors.push({ message: 'Username must be at least 8 characters long!' });
            valid = false;
        }

        if (!password) {
            errors.push({ message: 'Password is required!' });
            valid = false;
        } else {
            if (password.length < 8) {
                errors.push({ message: 'Password must be at least 8 characters long!' });
                valid = false;
            }
            if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
                errors.push({ message: 'Password must contain a special character!' });
                valid = false;
            }
            if (!/[a-zA-Z]/.test(password)) {
                errors.push({ message: 'Password must contain at least one letter!' });
                valid = false;
            }
            if (!/[0-9]/.test(password)) {
                errors.push({ message: 'Password must contain at least one number!' });
                valid = false;
            }
        }

        if (!passwordConfirm) {
            errors.push({ message: 'Please confirm your password!' });
            valid = false;
        } else if (password !== passwordConfirm) {
            errors.push({ message: 'Passwords do not match!' });
            valid = false;
        }

        // Display errors if validation fails
        if (!valid) {
            displayErrorMessages(errors);
        } else {
            // If everything is valid, submit the form programmatically
            document.getElementById('signupForm').submit();
        }
    };

    const resetErrorMessages = () => {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerHTML = ''; // Clear existing errors
    };

    const displayErrorMessages = (errors) => {
        const errorContainer = document.getElementById('errorContainer');
        errors.forEach(error => {
            const errorElement = document.createElement('p');
            errorElement.classList.add('errMessage');
            errorElement.style.color = 'red';
            errorElement.innerText = error.message;
            errorContainer.appendChild(errorElement);
        });
    };

    // Bind the function to the form's submit event
    document.getElementById('signupForm').addEventListener('submit', handleFormSubmit);
});
