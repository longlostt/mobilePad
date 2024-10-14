const output = document.querySelector('.pad-output .output');
const outputName = document.querySelector('.pad-output .name');
const openList = document.querySelector('.open-list');
const contactsContainer = document.querySelector('.contact-list');
const inputItems = document.querySelectorAll('.input-item');
const backspace = document.querySelector('#backspace');
const removeContact = document.querySelector('#removeContact');
const addContactButton = document.querySelector('.add-contact');
const overlay = document.querySelector('.overlay');
const alertsContainer = document.querySelector('.alerts');


addContactButton.addEventListener('click', async function () {
    let prompt = window.prompt('Enter the name');
    
    if (!prompt || !output.innerText.trim()) {
        console.error('Name or number is missing');
        return;
    }

    let number = output.innerText.trim(); 
    let name = prompt.trim(); 

    try {
        const response = await fetch('/api/contacts');
        const data = await response.json();
        const userID = data.userID;  
        console.log('Data being sent:', { name, phone: number, userId: userID });
        const saveResponse = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone: number, userId: userID })  
        });
        
        if (!saveResponse.ok) {
            const errorText = await saveResponse.text();  
            throw new Error(`Failed to save contact: ${errorText}`);
        }

        const savedContact = await saveResponse.json();

        // Only append the contact to the DOM after successful save
        let contact = document.createElement('div');
        contact.classList.add('contact');
        contact.innerHTML = `
            <p class="contact-name">${name}</p>
            <p class="contact-number">${number}</p>
        `;
        contactsContainer.appendChild(contact);

    } catch (error) {
        console.error('Error:', error);
    }
});

removeContact.addEventListener('click', async function () {
    let number = output.innerText.trim();
    
    if (!number) {
        console.error('No number inputted');
        return;
    }
    
    // Fetch user ID and contacts to find the corresponding contact
    try {
        const response = await fetch('/api/contacts');
        const data = await response.json();
        const userID = data.userID;
        const contacts = data.contacts; 
        console.log('Contacts:', contacts);

        // Find the contact with the matching phone number
        const contactToDelete = contacts.find(contact => contact.phone === number);
        if (!contactToDelete) {
            console.error('Contact not found');
            return;
        }

        // Send DELETE request to the server
        const deleteResponse = await fetch(`/api/contacts/${contactToDelete._id}`, {
            method: 'DELETE',
        });

        if (!deleteResponse.ok) {
            throw new Error('Failed to delete contact');
        }

        // Remove the contact from the DOM
        const contactDiv = findContactByNumber(number); 
        if (contactDiv) {
            contactsContainer.removeChild(contactDiv); 
            console.log('Contact deleted successfully');
    
            output.innerText = '0';
            outputName.innerText = '';
            enteredDigits = '0';
        } else {
            console.error('Contact not found in the DOM');
        }

    } catch (error) {
        console.error('Error:', error);
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


contactsContainer.addEventListener('click', function (event) {
    const clickedContact = event.target.closest('.contact');
    if (clickedContact) {
        const contactNumber = clickedContact.querySelector('.contact-number').innerText;
        output.innerText = contactNumber;
        updateName(contactNumber)
    }
});

// Event listener for clicking on the overlay to cancel
// overlay.addEventListener('click', function () {

// });

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
    return Array.from(contactsContainer.children).find(contact => {
        const contactName = contact.querySelector('.contact-name').innerText;
        return contactName === name;
    });
}

// Function to find a contact by number
function findContactByNumber(number) {
    return Array.from(contactsContainer.children).find(contact => {
        const contactNumber = contact.querySelector('.contact-number').innerText;
        return contactNumber === number;
    });
}

