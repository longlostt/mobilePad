const handleFormSubmit = async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    const username = usernameInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    const storedCredentials = JSON.parse(localStorage.getItem('credentials')) || [];

    const specialCharRegex = /[!@#$~%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;

    // Reset styling and error messages
    usernameInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
    passwordConfirmInput.style.borderColor = '';
    document.querySelector('#char').style.display = 'none';
    document.querySelector('#letter').style.display = 'none';
    document.querySelector('#number').style.display = 'none';
    document.querySelector('#userLength').style.display = 'none';
    document.querySelector('#passLength').style.display = 'none';
    document.querySelector('#notMatch').style.display = 'none';
    document.querySelector('#userExist').style.display = 'none';

    if (!username || !password || !passwordConfirm) {
        if (!username) {
            usernameInput.style.borderColor = 'red';
            document.getElementById('userLength').style.display = 'block';
        }
        if (!password) {
            passwordInput.style.borderColor = 'red';
            document.getElementById('passLength').style.display = 'block';
        }
        if (!passwordConfirm) {
            passwordConfirmInput.style.borderColor = 'red';
            document.getElementById('notMatch').style.display = 'block';
        }
        return;
    }
    if (username.length < 8) {
        usernameInput.style.borderColor = 'red';
        document.querySelector('#userLength').style.display = 'block';
        return;
    } else if (password.length < 8) {
        passwordInput.style.borderColor = 'red';
        document.querySelector('#passLength').style.display = 'block';
        return;
    } else if (password !== passwordConfirm) {
        passwordInput.style.borderColor = 'red';
        passwordConfirmInput.style.borderColor = 'red';
        document.querySelector('#notMatch').style.display = 'block';
        return;
    } 

    if (!specialCharRegex.test(password)) {
        passwordInput.style.borderColor = 'red';
        document.querySelector('#char').style.display = 'block';
        return;
    } else if (!letterRegex.test(password)) {
        passwordInput.style.borderColor = 'red';
        document.querySelector('#letter').style.display = 'block';
        return;
    } else if (!numberRegex.test(password)) {
        passwordInput.style.borderColor = 'red';
        document.querySelector('#number').style.display = 'block';
        return;
    } else {
        // Check if the username already exists
        const usernameExists = storedCredentials.some(cred => cred.username.toLowerCase() === username.toLowerCase());
        if (usernameExists) {
            usernameInput.style.borderColor = 'red';
            document.querySelector('#userExist').style.display = 'block';
            return;
        }
        
        // Hash the password using SHA-256
        const hashedPassword = await sha256(password);

        storedCredentials.push({ username, password: hashedPassword });
        localStorage.setItem('credentials', JSON.stringify(storedCredentials));
        window.open('http://127.0.0.1:3000/ICT/Mobile%20Pad/login%20page/login.html', '_self');
    }
};


// SHA-256 hashing function
async function sha256(str) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return hex(hashBuffer);
}

// hash buffer to hexadecimal string (whatever that uck that means)
function hex(buffer) {
    const hexCodes = [];
    const view = new DataView(buffer);
    for (let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i);
        const stringValue = value.toString(16);
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        hexCodes.push(paddedValue);
    }
    return hexCodes.join('');
}

const signUp = document.querySelector('#signUp');
signUp.addEventListener('click', handleFormSubmit);
