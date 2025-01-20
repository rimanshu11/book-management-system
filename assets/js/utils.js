export class Utils {
    static toggleLoader(isLoading) {
        const loaderElement = document.getElementById('loader');
        loaderElement?.classList.toggle('hidden', !isLoading);
    }
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
    static showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        const closeModalBtn = document.getElementById('closeModalBtn');
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
}
