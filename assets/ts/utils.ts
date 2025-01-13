class Utils {
  public sortBy: HTMLSelectElement | null;
  public sortBtn: HTMLSelectElement | null;

  constructor() {
    this.sortBy = document.getElementById('sortBy') as HTMLSelectElement | null;
    this.sortBtn = document.getElementById(
      'sortBtn',
    ) as HTMLSelectElement | null;
  }
  // Method to show and hide the loader
  static toggleLoader(isLoading: boolean) {
    const loaderElement = document.getElementById('loader');
    loaderElement?.classList.toggle('hidden', !isLoading);
  }

  // method to show or hide error messages
  static toggleError(fieldId: string, message: string = ''): void {
    const errorElement = document.getElementById(fieldId);
    if (message) {
      errorElement!.textContent = message;
      errorElement!.classList.remove('hidden');
    } else {
      errorElement!.textContent = '';
      errorElement!.classList.add('hidden');
    }
  }

  // Method to show modal with a message
  static showModal(message: string): void {
    const modal = document.getElementById('modal') as HTMLElement;
    const modalMessage = document.getElementById('modalMessage') as HTMLElement;
    const closeModalBtn = document.getElementById(
      'closeModalBtn',
    ) as HTMLButtonElement;

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
