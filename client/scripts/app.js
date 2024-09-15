const output = document.querySelector('.pad-output .output');
const outputName = document.querySelector('.pad-output .name');
const openList = document.querySelector('.open-list');
const contacts = document.querySelector('.contact-list');
const inputItems = document.querySelectorAll('.input-item');
const backspace = document.querySelector('#backspace');
const removeContact = document.querySelector('#removeContact');
const addContactButton = document.querySelector('.add-contact');
const overlay = document.querySelector('.overlay');
const alertsContainer = document.querySelector('.alerts');

// Function to create an alert
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
            <button id="nameButton" class="alertButton">${buttonText}</button>
            ${secondButton ? `<button id="numberButton" class="alertButton cancelButton">${buttonText2}</button>` : ''}
        </div>
    </div>
    `;
    return alert;
}

// Function to show an alert
function showAlert(alertMarkup) {
    alertsContainer.innerHTML = alertMarkup;
    alertsContainer.style.opacity = '1';
    alertsContainer.style.zIndex = '9999';
    overlay.style.opacity = '1';
    overlay.style.zIndex = '9999';
    document.querySelector('.alertButton').addEventListener('click', hideAlert); // works on the FIRST button 

}

// Function to hide an alert
function hideAlert() {
    alertsContainer.style.opacity = '0';
    alertsContainer.style.zIndex = '0';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '1';
    alertsContainer.innerHTML = '';

}

// Event listener for "Add Contact" button
addContactButton.addEventListener('click', function () {
    if (output.innerText == '' || output.innerText == '0') {
        const alertMarkup = createAlert("Input phone number first!", false, "OK", '', "numAlert");
        showAlert(alertMarkup);
    } else {
        if (outputName.innerText == '') {
            const alertMarkup = createAlert("Enter contact name", true, "Add", "Nevermind", "addAlert");
            showAlert(alertMarkup);
        } else {
            const alertMarkup = createAlert('Contact already exists!', false, 'OK', false, '')
            showAlert(alertMarkup)
            return;
        }
    }

});

// Event listener for "Remove Contact" button
removeContact.addEventListener('click', function () {
    const alertMarkup = createAlert("Who would you like to remove?", true, "Remove", "Nevermind", "delAlert");
    showAlert(alertMarkup);
});


// add/delete
document.addEventListener('click', function (event) {
    const alertButton = event.target.closest('.alertButton');
    const alert = event.target.closest('.alert');
    if (alertButton && !alertButton.classList.contains('cancelButton') && alert && alert.id === 'addAlert') { // add
        const inputField = alert.querySelector('.alertInput');
        const newContactName = inputField.value;
        if (!newContactName) {
            const alertMarkup = createAlert("Please input a contact name", false, 'OK', false, '');
            showAlert(alertMarkup);
            return;
        }
        const newContactNumber = enteredDigits;
        const newContact = document.createElement('div');
        newContact.classList.add('contact');
        newContact.innerHTML = `
            <div class="contact-name">${newContactName}</div>
            <div class="contact-number">${newContactNumber}</div>
            <div class="call-btn input-item svg-item"><i class="fa-solid fa-phone"></i></div>
        `;
        contacts.appendChild(newContact);
        hideAlert();
        enteredDigits = '';
        output.innerText = '0';
        outputName.innerText = '';
        inputField.value = '';
    } else if (alertButton && !alertButton.classList.contains('cancelButton') && alert && alert.id === 'delAlert') { // delete
        const inputField = alert.querySelector('.alertInput').value.toUpperCase();
        let contactToRemove;

        const contactByName = findContactByName(inputField.toUpperCase());
        const contactByNumber = findContactByNumber(inputField);

        if (contactByName && contactByNumber) { // duplicate logic
            const alertMarkup = createAlert("Duplicate name and number found! Specify who", false, `Name: ${inputField}`, `Number: ${inputField}`, '');
            showAlert(alertMarkup);

            const nameButton = document.querySelector('#nameButton');
            const numberButton = document.querySelector('#numberButton');
            nameButton.addEventListener('click', function () {
                contactToRemove = contactByName
                contactToRemove.remove()
            });
            numberButton.addEventListener('click', function () {
                contactToRemove = contactByNumber
                contactToRemove.remove()
            });
            return;
        }

        if (contactByName) {
            contactToRemove = contactByName;
            contactToRemove.remove();
        }
        if (contactByNumber) {
            contactToRemove = contactByNumber;
            contactToRemove.remove();
        }

        if (!contactToRemove) {
            const alertMarkup = createAlert("Contact couldn't be found", false, 'OK', false, '');
            showAlert(alertMarkup);
            return;
        }

        hideAlert();
        enteredDigits = '';
        output.innerText = '0';
        outputName.innerText = '';
        inputField.value = '';


    } else if (alertButton && alertButton.classList.contains('cancelButton')) {
        hideAlert();
        return
    }
});

////

// Event listener for "Open/Close List" button
let toggle = true;
openList.addEventListener('click', function () {
    const contactList = document.querySelector('.contact-list');
    const arrows = document.querySelectorAll('.open-list p');
    const container = document.querySelector('.container');

    if (toggle) {
        contactList.style.transform = "translate(0px, 0)";
        openList.style.transform = "translate(0px, 0)";
        container.style.transform = 'translate(0px,0)';
        container.style.boxShadow = "rgba(0, 0, 0, 0.2) -5px 0px 40px";
        arrows.forEach(arrow => {
            arrow.style.transform = "rotate(180deg)";
        });

        toggle = false;
    } else {
        contactList.style.transform = null;
        openList.style.transform = null;
        container.style.transform = null;
        container.style.boxShadow = "0 0 0 0 rgba(0, 0, 0, 0)";
        arrows.forEach(arrow => {
            arrow.style.transform = null;
        });

        toggle = true;
    }
});

enteredDigits = '0'; //initial output

// Event listener for "Backspace" button
backspace.addEventListener('click', function (e) {
    e.stopPropagation();
    enteredDigits = enteredDigits.slice(0, -1);
    output.innerText = enteredDigits;
    updateName(enteredDigits);
});

// Event listeners for the number buttons
inputItems.forEach(button => {
    button.addEventListener('click', function (event) {
        event.stopPropagation();
        const digit = button.innerText.charAt(0);
        enteredDigits += digit;
        output.innerText = enteredDigits;
        updateName(enteredDigits);
    });
});

// keydown to output
document.addEventListener('keydown', function (e) { 
    if (e.target.closest('.alert')) return;
    if (e.key !== 'Backspace' && e.repeat) return;
    

    const input = document.querySelector(`.input-item[data-key="${e.key}"]`);
    if (!input) return;


    if (e.key === "Backspace") { // Corrected to use === for comparison
        enteredDigits = enteredDigits.slice(0, -1);
        output.innerText = enteredDigits;
        updateName(enteredDigits);

    }
    else if (e.key !== "Backspace") { // Corrected to use !== for comparison
        enteredDigits += e.key;
        output.innerText = enteredDigits;
        updateName(enteredDigits);
    } 
});


contacts.addEventListener('click', function (event) {
    const clickedContact = event.target.closest('.contact');
    if (clickedContact) {
        const contactNumber = clickedContact.querySelector('.contact-number').innerText;
        output.innerText = contactNumber;
        updateName(contactNumber)
    }
});

// Event listener for clicking on the overlay to cancel
overlay.addEventListener('click', function () {
    hideAlert();
});

// Function to update the contact name in the output
function updateName(number) {
    const matchedContact = findContactByNumber(number);

    if (matchedContact) {
        const contactName = matchedContact.querySelector('.contact-name').innerText;
        outputName.innerText = contactName;
    } else {
        outputName.innerText = '';
    }
}

function findContactByName(name) {
    return Array.from(contacts.children).find(contact => {
        const contactName = contact.querySelector('.contact-name').innerText;
        return contactName === name;
    });
}

// Function to find a contact by number
function findContactByNumber(number) {
    return Array.from(contacts.children).find(contact => {
        const contactNumber = contact.querySelector('.contact-number').innerText;
        return contactNumber === number;
    });
}

