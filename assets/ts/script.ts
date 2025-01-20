import { Utils } from './utils';
import { FormHandler, formData } from './formHandler';

export class Book {
  private utils: Utils;
  private formhandler: FormHandler;
  // public editIndex: number | null;
  public sortBy: HTMLSelectElement | null;
  public sortBtn: HTMLSelectElement | null;

  constructor(utils: Utils, formhandler: FormHandler) {
    this.utils = utils;
    this.formhandler = formhandler;
    this.sortBy = document.getElementById('sortBy') as HTMLSelectElement | null;
    this.sortBtn = document.getElementById(
      'sortBtn',
    ) as HTMLSelectElement | null;
  }

  setFormHandlerInstance(formHandler: FormHandler): void {
    this.formhandler = formHandler;
  }
  // Method to bid all the Data
  public bindEvents(): void {
    // Fix for reset button
    document
      .getElementById('resetForm')
      ?.addEventListener('click', () => {
        this.formhandler.handleFormReset();
      });
      document.querySelectorAll('[id^="editBtn-"]').forEach((btn, index) => {
      console.log(index);
      btn.addEventListener('click', () => this.editBook(index));
    });
  
    document.querySelectorAll('[id^="deleteBtn-"]').forEach((btn, index) => {
      console.log(index);
      btn.addEventListener('click', () => this.deleteBook(index));
    });  
    this.toggleSortBtn()
  }
  
  toggleSortBtn(): void {
    const genreFilter = document.getElementById(
      'genreFilter',
    ) as HTMLSelectElement;

    if (this.formhandler.bookList.length <= 1) {
      genreFilter.disabled = true;
      this.sortBy!.disabled = true;
      this.sortBtn!.disabled = true;
    } else {
      genreFilter.disabled = false;
      this.sortBy!.disabled = false;
      genreFilter?.addEventListener('change', this.filterGenre.bind(this));
      this.sortBy?.addEventListener('change', () => {
        if (this.sortBy!.value !== '') {
          this.sortBtn!.disabled = false;
        }
      });

      this.sortBtn?.addEventListener('change', this.sortBook.bind(this));
    }
  }


  // Method to sort books by title or author
  public sortBook(): void {
    const sortBy = this.sortBy!.value;
    const sortBtn = this.sortBtn!.value; // Here, you should use the state from sortBy
    const sortedBooks = this.sortBooks(sortBy, sortBtn);
    this.updateTableData(sortedBooks);
  }

  // Sorting logic based on user selection
  sortBooks(sortBy: string, sortBtn: string): formData[] {
    const sortedBooks = [...this.formhandler.bookList];
    const direction = sortBtn === 'dsc' ? -1 : 1;

    if (sortBy === 'author') {
      sortedBooks.sort((a, b) => {
        const authorA = a.author ? String(a.author) : '';
        const authorB = b.author ? String(b.author) : '';
        return direction * authorA.localeCompare(authorB);
      });
    } else if (sortBy === 'title') {
      sortedBooks.sort((a, b) => {
        const titleA = a.title ? String(a.title) : '';
        const titleB = b.title ? String(b.title) : '';
        return direction * titleA.localeCompare(titleB);
      });
    }

    return sortedBooks;
  }

  // Update submit button text for editing or adding
  public updateSubmitButton(text: string): void {
    (
      document.querySelector('[type="submit"]') as HTMLButtonElement
    ).textContent = text;
  }

  // Method to update the table data after adding/editing a book
  public updateTableData(books: formData[]): void {
    const tableBody = document.querySelector('#tableData tbody')!;
    tableBody.innerHTML = '';

    const rows = books.map((book, index) => this.createTableRow(book, index));
    tableBody.insertAdjacentHTML('beforeend', rows.join(''));
    this.bindEvents();
  }

  // Create table row for each book
  public createTableRow(book: formData, index: number): string {
    return `
          <tr class="border text-center even:bg-gray-200 odd:bg-white">
              <td class="border">${book.author}</td>
              <td class="border">${book.title}</td>
              <td class="border">${book.isbn}</td>
              <td class="border">${book.publicationDate}</td>
              <td class="border">${book.genre}</td>
              <td class="border">${this.discountCalculation(
                book.price,
                book.discountPrice,
              )}</td>
              <td class="border">${book.bookAge}</td>
              <td class="border">
                  <button id="editBtn-${index}" class="border w-full p-1 bg-indigo-500 text-white hover:bg-indigo-700">Edit</button>
                  <button id="deleteBtn-${index}" class="border w-full p-1 bg-red-500 text-white hover:bg-red-700">Delete</button>
              </td>
          </tr>
      `;
  }

  // Method to show confirmation modal before deletion
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
    confirmDeleteMessage.textContent = `Are you sure you want to delete the book titled "${this.formhandler.bookList[index].title}"?`;

    confirmDeleteModal.classList.remove('hidden');
    confirmDeleteBtn.addEventListener('click', () => {
      this.deleteBookConfirmed(index);
      confirmDeleteModal.classList.add('hidden');
    });

    cancelDeleteBtn.addEventListener('click', () => {
      confirmDeleteModal.classList.add('hidden');
    });
  }

  // Method to delete the book after confirmation
  public deleteBookConfirmed(index: number): void {
    this.formhandler.bookList.splice(index, 1);
    this.updateTableData(this.formhandler.bookList);
    // this.bindEvents();
    this.totalBookCount();
    Utils.showModal('Book Deleted Successfully');
  }
  // Method to delete specific book from the table
  public deleteBook(index: number): void {
    this.showDeleteConfirmationModal(index);
  }

  // Method to edit a specific book
  public editBook(index: number): void {
    const book = this.formhandler.bookList[index];
    this.formhandler.cachedFormData = { ...book };
    this.formhandler.setForm(book);
    this.formhandler.editIndex = index;
    this.updateSubmitButton('Update Book');
  }
  // Method to count books in table
  public totalBookCount() {
    const displayTotalBook = document.getElementById(
      'total-iteam',
    ) as HTMLElement;
    displayTotalBook.innerHTML = `Total Books: ${this.formhandler.bookList.length}`;
  }

  // Method to filter books by genre
  public filterGenre(event: Event): void {
    const selectedGenre = (event.target as HTMLSelectElement).value
      .trim()
      .toLowerCase();
    const filteredBooks = selectedGenre
      ? this.formhandler.bookList.filter(
          (book) => book.genre.toLowerCase() === selectedGenre,
        )
      : this.formhandler.bookList;
    this.updateTableData(filteredBooks);
  }

  // Method to sort books by title
  // public sortBook(): void {
  //   const sortBy = this.sortBy!.value;
  //   const sortBtn = this.sortBtn!.value;
  //   const sortedBooks = this.sortBooks(sortBy, sortBtn);
  //   this.updateTableData(sortedBooks);
  // }

  // sortBooks(sortBy: string, sortBtn: string): formData[] {
  //   const sortedBooks = [...this.formhandler.bookList];
  //   const direction = sortBtn === 'dsc' ? -1 : 1;

  //   if (sortBy === 'author') {
  //     sortedBooks.sort((a, b) => {
  //       const authorA = a.author ? String(a.author) : '';
  //       const authorB = b.author ? String(b.author) : '';
  //       return direction * authorA.localeCompare(authorB);
  //     });
  //   } else if (sortBy === 'title') {
  //     sortedBooks.sort((a, b) => {
  //       const titleA = a.title ? String(a.title) : '';
  //       const titleB = b.title ? String(b.title) : '';
  //       return direction * titleA.localeCompare(titleB);
  //     });
  //   }

  //   return sortedBooks;
  // }

  // method to calculate discount
  public discountCalculation(price: number, discountedPrice: number): string {
    if (price === undefined && discountedPrice === undefined) {
      price = 0;
      discountedPrice = 0;
      if (price === discountedPrice) {
        return `<span class="text-green-500 font-bold">${price.toFixed()} /-</span>`;
      } else {
        const percentage = (discountedPrice / price) * 100;
        const discountPercentage = (100 - percentage).toFixed();

        return `
              <span class="line-through text-red-500 font-semibold">${price.toFixed()} rs/-</span>
              <span class="text-green-600 font-bold">(${discountPercentage}% Off)</span><br>
              <span class=" text-blue-600  font-semibold">${discountedPrice.toFixed()} rs/-</span>
            `;
      }
    } else {
      if (price === discountedPrice || discountedPrice === 0) {
        return `<span class="text-green-500 font-bold">${price.toFixed()} rs/-</span>`;
      } else {
        const percentage = (discountedPrice / price) * 100;
        const discountPercentage = (100 - percentage).toFixed();
        return `
            <span class="line-through text-red-500 font-semibold">${price.toFixed()} rs/-</span>
            <span class="text-green-600 font-bold">(${discountPercentage}% Off)</span><br>
            <span class=" text-blue-600  font-semibold">${discountedPrice.toFixed()} rs/-</span>
          `;
      }
    }
  }
}
// const book = new Book();
