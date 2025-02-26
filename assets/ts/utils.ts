export class Utils {

  static toggleLoader(isLoading: boolean) {
    const loaderElement = document.getElementById('loader');
    loaderElement?.classList.toggle('hidden', !isLoading);
  }

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

  static showModal(message: string): void {
    const modal = document.getElementById('modal') as HTMLElement;
    const modalMessage = document.getElementById('modalMessage') as HTMLElement;
    const closeModalBtn = document.getElementById('closeModalBtn') as HTMLButtonElement;

    modalMessage.textContent = message;
    modal.classList.remove('hidden');

    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
  
}
