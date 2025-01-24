import { Utils } from './utils.ts';
import { FormHandler } from './formHandler.ts';
import { ShowTable } from './showTable.ts';
import { formData } from './bookStore.ts';
import { BookStore } from './bookStore.ts';
import { BookManagerHelper } from './bookManageHelper.ts';
export class BookManager {
  private bookStore: BookStore;
  private formhandler: FormHandler;
  private showTable: ShowTable;
  private bookManagerHelper: BookManagerHelper;
  public toggleEvent: boolean;

  constructor(
    formhandler: FormHandler,
    bookStore: BookStore,
    showTable: ShowTable,
    bookManagerHelper: BookManagerHelper,
  ) {
    this.formhandler = formhandler;
    this.bookStore = bookStore;
    this.showTable = showTable;
    this.bookManagerHelper = bookManagerHelper;
    this.toggleEvent = false;
  }
  public toggleBindEvent(value: boolean): void {
    this.toggleEvent = value;
    this.bindEvents();
  }

  public bindEvents(): void {
    const genreFilter = document.getElementById(
      'genreFilter',
    ) as HTMLSelectElement;
    document.getElementById('resetForm')?.addEventListener('click', () => {
      this.formhandler.handleFormReset();
    });
    genreFilter?.addEventListener('change', this.filterGenre.bind(this));

    this.bookManagerHelper.toggleSortBtn();
  }


  public updateSubmitButton(text: string): void {
    (
      document.querySelector('[type="submit"]') as HTMLButtonElement
    ).textContent = text;
  }

  public showDeleteConfirmationModal(index: number): void {
    const confirmDeleteModal = document.getElementById(
      'confirmDeleteModal',
    ) as HTMLElement;
    const confirmDeleteMessage = document.getElementById(
      'confirmDeleteMessage',
    ) as HTMLElement;
    const confirmDeleteBtn = document.getElementById(
      'confirmDeleteBtn',
    ) as HTMLButtonElement;
    const cancelDeleteBtn = document.getElementById(
      'cancelDeleteBtn',
    ) as HTMLButtonElement;
    confirmDeleteMessage.textContent = `Are you sure you want to delete the book titled "${this.bookStore.bookList[index].title}"?`;

    confirmDeleteModal.classList.remove('hidden');
    confirmDeleteBtn.addEventListener('click', () => {
      this.deleteBookConfirmed(index);
      confirmDeleteModal.classList.add('hidden');
    });

    cancelDeleteBtn.addEventListener('click', () => {
      confirmDeleteModal.classList.add('hidden');
    });
  }

  public deleteBookConfirmed(index: number): void {
    this.bookStore.bookList.splice(index, 1);
    this.showTable.updateTableData(this.bookStore.bookList);
    // this.bindTableEvents();
    this.bookStore.totalBookCount();
    Utils.showModal('Book Deleted Successfully');
  }

  public deleteBook(index: number): void {
    this.showDeleteConfirmationModal(index);
  }

  public editBook(index: number): void {
    const book = this.bookStore.bookList[index];
    this.formhandler.cachedFormData = { ...book };
    this.setForm(book);
    this.formhandler.editIndex = index;
    this.updateSubmitButton('Update Book');
  }

  public filterGenre(event: Event): void {
    const selectedGenre = (event.target as HTMLSelectElement).value
      .trim()
      .toLowerCase();
    const filteredBooks = selectedGenre
      ? this.bookStore.bookList.filter(
          (book) => book.genre.toLowerCase() === selectedGenre,
        )
      : this.bookStore.bookList;
    this.showTable.updateTableData(filteredBooks);
    // this.bindTableEvents();
  }


  // Method to set form data
  public setForm(data: formData): void {
    const formElements = {
      title: document.getElementById('title') as HTMLInputElement,
      author: document.getElementById('author') as HTMLInputElement,
      isbn: document.getElementById('isbn') as HTMLInputElement,
      publicationDate: document.getElementById(
        'publicationDate',
      ) as HTMLInputElement,
      listPrice: document.getElementById('listPrice') as HTMLInputElement,
      discountPrice: document.getElementById(
        'discountPrice',
      ) as HTMLInputElement,
      genre: document.getElementById('genre') as HTMLSelectElement,
    };
    formElements.title.value = data.title;
    formElements.author.value = data.author;
    formElements.isbn.value = data.isbn;
    formElements.isbn.disabled = true;
    formElements.publicationDate.value = data.publicationDate;
    formElements.listPrice.value = data.price.toString();
    formElements.discountPrice.value = data.discountPrice.toString();

    const genreSelect = formElements.genre;
    const genreOptions = Array.from(genreSelect.options).map((option) =>
      option.value.toLowerCase(),
    );
    const bookGenre = data.genre.trim().toLowerCase();
    if (!genreOptions.includes(bookGenre)) {
      const newOption = document.createElement('option');
      newOption.value = data.genre;
      newOption.textContent = data.genre;
      genreSelect.appendChild(newOption);
    }
    genreSelect.value = data.genre;
    formElements.title.focus();
  }
}
