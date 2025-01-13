"use strict";
class Utils {
    sortBy;
    sortBtn;
    constructor() {
        this.sortBy = document.getElementById('sortBy');
        this.sortBtn = document.getElementById('sortBtn');
    }
    // Method to show and hide the loader
    static toggleLoader(isLoading) {
        const loaderElement = document.getElementById('loader');
        loaderElement?.classList.toggle('hidden', !isLoading);
    }
    // method to show or hide error messages
    static toggleError(fieldId, message = '') {
        const errorElement = document.getElementById(fieldId);
        if (message) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        else {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }
    // Method to show modal with a message
    static showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        const closeModalBtn = document.getElementById('closeModalBtn');
        // Set the message and display the modal
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
        // Close modal when the button is clicked
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
}
const utils = new Utils();
