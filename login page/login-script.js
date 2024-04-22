// alerts
const alertsContainer = document.querySelector('.alerts');
const overlay = document.querySelector('.overlay');

function createAlert(message, hasInput, buttonText, buttonText2, id) {
    let secondButton = '';
    if (buttonText2) {
        secondButton = `<button class="alertButton cancelButton">${buttonText2}</button>`;
    }
    const alert = `
            <div class="alert" id="${id}">
                <p>${message}</p>
                ${hasInput ? '<input type="text" class="alertInput">' : ''}
                <div class="alertButtons"> 
                    <button class="alertButton">${buttonText}</button>
                    ${secondButton}
                </div>
            </div>
        `;
    return alert;
}

function showAlert(alertMarkup) {
    alertsContainer.innerHTML = alertMarkup;
    alertsContainer.style.opacity = '1';
    alertsContainer.style.zIndex = '9999';
    overlay.style.opacity = '1';
    overlay.style.zIndex = '9998';
    document.querySelector('.alertButton').addEventListener('click', hideAlert); // works on the FIRST button 

}

function hideAlert() {
    alertsContainer.style.opacity = '0';
    alertsContainer.style.zIndex = '-9999';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '-9998';
    alertsContainer.innerHTML = '';

}

overlay.addEventListener('click', function () {
    hideAlert();
});

// login logic
const handleFormSubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const storedCredentials = JSON.parse(localStorage.getItem('credentials')) || [];

    // Find the stored credentials for the entered username
    const userCredentials = storedCredentials.find(cred => cred.username === username);

    if (userCredentials) {
        // Hash the entered password using SHA-256
        const hashedPassword = await sha256(password);

        // Compare the hashed password with the stored hashed password
        if (hashedPassword === userCredentials.password) {
            const alertMarkup = createAlert('Login successful!', false, 'OK', false, '');
            showAlert(alertMarkup);
            window.open('http://127.0.0.1:3000/ICT/Mobile%20Pad/main/index.html', '_self');
        } else {
            const alertMarkup = createAlert('Invalid password! Please try again', false, 'Ok', false, '');
            showAlert(alertMarkup);
        }
    } else {
        const alertMarkup = createAlert('User not found!', false, 'OK', false, '');
        showAlert(alertMarkup)
    }
};

// SHA-256 hashing function
async function sha256(str) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return hex(hashBuffer);
}

// Convert hash buffer to hexadecimal string
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

const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', handleFormSubmit);
