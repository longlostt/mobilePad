// const { response } = require("express");

// // alerts
// const alertsContainer = document.querySelector('.alerts');
// const overlay = document.querySelector('.overlay');

// function createAlert(message, hasInput, buttonText, buttonText2, id) {
//     let secondButton = '';
//     if (buttonText2) {
//         secondButton = `<button class="alertButton cancelButton">${buttonText2}</button>`;
//     }
//     const alert = `
//             <div class="alert" id="${id}">
//                 <p>${message}</p>
//                 ${hasInput ? '<input type="text" class="alertInput">' : ''}
//                 <div class="alertButtons"> 
//                     <button class="alertButton">${buttonText}</button>
//                     ${secondButton}
//                 </div>
//             </div>
//         `;
//     return alert;
// }

// function showAlert(alertMarkup) {
//     alertsContainer.innerHTML = alertMarkup;
//     alertsContainer.style.opacity = '1';
//     alertsContainer.style.zIndex = '9999';
//     overlay.style.opacity = '1';
//     overlay.style.zIndex = '9998';
//     document.querySelector('.alertButton').addEventListener('click', hideAlert); // works on the FIRST button 
// }

// function hideAlert() {
//     alertsContainer.style.opacity = '0';
//     alertsContainer.style.zIndex = '-9999';
//     overlay.style.opacity = '0';
//     overlay.style.zIndex = '-9998';
//     alertsContainer.innerHTML = '';
// }

// overlay.addEventListener('click', function () {
//     hideAlert();
// });

// // New login logic
// const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     try {
//         // Send credentials to the backend for verification
//         const response = await fetch('/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: new URLSearchParams({
//                 username,
//                 password
//             })
            
//         });
//         const result = await response.json();
      
//         if (!result.success) {
//             const alertMarkup = createAlert(result.error, false, 'OK', false, '');
//             showAlert(alertMarkup);
//         } else {
//             const alertMarkup = createAlert('Login successful!', false, 'OK', false, '');
//             showAlert(alertMarkup);
//             window.location.href = '/index'; // Redirect to the main page after login
//         }
//     } catch (error) {
//         const alertMarkup = createAlert('An error occurred! Please try again.', false, 'OK', false, '');
//         showAlert(alertMarkup);
//     }
// };

// // Attach event listener to the form submit button
// const loginForm = document.querySelector('.login-form');
// loginForm.addEventListener('submit', handleFormSubmit);
