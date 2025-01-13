interface formData {
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  price: number;
  discountPrice: number;
  genre: string;
  bookAge: string;
}

class Book {
  public form: HTMLFormElement | null;
  public bookList: formData[];
  public editIndex: number | null;
  public cachedFormData: formData;
  public sortBy;
  public sortBtn;
  constructor() {
    this.form = document.getElementById('formData') as HTMLFormElement | null;
    this.sortBy = document.getElementById('sortBy') as HTMLSelectElement | null;
    this.sortBtn = document.getElementById(
      'sortBtn',
    ) as HTMLSelectElement | null;
    this.bookList = [];
    this.editIndex = null;
    this.cachedFormData = {
      title: '',
      author: '',
      isbn: '',
      publicationDate: '',
      price: 0,
      discountPrice: 0,
      genre: '',
      bookAge: '',
    };
    this.bindEvents();
  }
  // Method to bid all the Data
  bindEvents(): void {
    this.form?.addEventListener('submit', this.handleFormSubmit.bind(this));
    document
    .querySelector('[type="reset"]')
    ?.addEventListener('click', () => this.handleFormReset(true));  
    this.toggleSortBtn();
  }

  toggleSortBtn(): void {
    const genreFilter = document.getElementById(
      'genreFilter',
    ) as HTMLSelectElement;

    if (this.bookList.length <= 1) {
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
  // Method to handle form reset
  handleFormReset(triggerValidation: boolean = true): void {
    this.editIndex = null;
    const isbnInput = document.getElementById('isbn') as HTMLInputElement;
    isbnInput.disabled = false;
    this.form?.reset();
    this.updateSubmitButton('Add Book');
    const errorFields = [
      'title-error',
      'author-error',
      'isbn-error',
      'publicationDate-error',
      'price-error',
      'discountPrice-error',
      'genre-error',
    ];
    errorFields.forEach((field) => this.toggleError(field));
  
  }
  // Method to show modal with a message
  showModal(message: string): void {
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

  // Method to handle form submission
  handleFormSubmit(event: Event): void {
    event.preventDefault();
    this.cachedFormData = this.getFormData();
    if (!this.validateForm()) return;

    const {
      title,
      author,
      isbn,
      publicationDate,
      price,
      discountPrice,
      genre,
    } = this.cachedFormData;
    const bookAge = this.calculateBookAge(publicationDate).trim();
    if (bookAge) {
      if (this.editIndex !== null) {
        this.bookList[this.editIndex] = {
          ...this.bookList[this.editIndex],
          title,
          author,
          publicationDate,
          price,
          discountPrice,
          genre,
          bookAge,
        };
        this.editIndex = null;
        this.handleFormReset();
        this.showModal('Book Edited Successfully!');
      } else {
        this.bookList.push({
          title,
          author,
          isbn,
          publicationDate,
          price,
          discountPrice,
          genre,
          bookAge,
        });
        this.showModal('Book Added Successfully');
      }
    }
    this.updateTableData(this.bookList);
    // this.handleFormReset();
    this.totalBookCount();
    this.bindEvents();
  }

  // Get form data and return as an object
  getFormData(): formData {
    return {
      title: (
        document.getElementById('title') as HTMLInputElement
      ).value.trim(),
      author: (
        document.getElementById('author') as HTMLInputElement
      ).value.trim(),
      isbn: (document.getElementById('isbn') as HTMLInputElement).value.trim(),
      publicationDate: (
        document.getElementById('publicationDate') as HTMLInputElement
      ).value.trim(),
      price: Number(
        (document.getElementById('listPrice') as HTMLInputElement).value.trim(),
      ),
      discountPrice: Number(
        (
          document.getElementById('discountPrice') as HTMLInputElement
        ).value.trim(),
      ),
      genre: (
        document.getElementById('genre') as HTMLInputElement
      ).value.trim(),
      bookAge: '',
    };
  }

  // Validate the form inputs using cached data
  validateForm(): boolean {
    const {
      title,
      author,
      isbn,
      publicationDate,
      price,
      discountPrice,
      genre,
    } = this.cachedFormData;
    let isValid = true;

    const fields = { title, author, isbn, publicationDate, genre };
    Object.entries(fields).forEach(([field, value]) => {
      if (!value) {
        this.toggleError(
          `${field}-error`,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`,
        );
        isValid = false;
      } else {
        this.toggleError(`${field}-error`);
      }
    });

    if (price <= 0 || isNaN(price)) {
      this.toggleError('price-error', 'Price must be a valid positive number.');
      isValid = false;
    } else {
      this.toggleError('price-error');
    }

    if (discountPrice < 0 || isNaN(discountPrice)) {
      this.toggleError(
        'discountPrice-error',
        'Discount price must be a valid number.',
      );
      isValid = false;
    } else {
      this.toggleError('discountPrice-error');
    }

    if (discountPrice > price) {
      this.toggleError(
        'discountPrice-error',
        'Discount price cannot be higher than price.',
      );
      isValid = false;
    } else {
      this.toggleError('discountPrice-error');
    }

    if (isNaN(Number(isbn)) || isbn.length !== 13) {
      this.toggleError('isbn-error', 'ISBN must be 13 digits.');
      isValid = false;
    } else {
      this.toggleError('isbn-error');
    }

    return isValid;
  }

  // method to show or hide error messages
  toggleError(fieldId: string, message: string = ''): void {
    const errorElement = document.getElementById(fieldId);
    if (message) {
      errorElement!.textContent = message;
      errorElement!.classList.remove('hidden');
    } else {
      errorElement!.textContent = '';
      errorElement!.classList.add('hidden');
    }
  }

  // Method to calculate the age of the book
  calculateBookAge(publicationDate: string): string {
    const currentDate = new Date();
    const pubDate = new Date(publicationDate);
    const ageInYears = currentDate.getFullYear() - pubDate.getFullYear();
    const ageInMonths = currentDate.getMonth() - pubDate.getMonth();
    const ageInDays = currentDate.getDate() - pubDate.getDate();

    if (currentDate < pubDate) {
      alert('Wrong publication date!');
      return '';
    }

    let ageText =
      ageInYears > 0
        ? `${ageInYears} year(s)`
        : ageInMonths > 0
        ? `${ageInMonths} month(s)`
        : ageInDays > 0
        ? `${ageInDays} day(s)`
        : `Less than a day old`;
    return ageText;
  }

  // Update submit button text for editing or adding
  updateSubmitButton(text: string): void {
    (
      document.querySelector('[type="submit"]') as HTMLButtonElement
    ).textContent = text;
  }

  // Method to update the table data after adding/editing a book
  updateTableData(books: formData[]): void {
    const tableBody = document.querySelector('#tableData tbody')!;
    tableBody.innerHTML = '';

    const rows = books.map((book, index) => this.createTableRow(book, index));
    tableBody.insertAdjacentHTML('beforeend', rows.join(''));
  }

  // Create table row for each book
  createTableRow(book: formData, index: number): string {
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
                  <button class="border w-full p-1 bg-indigo-500 text-white hover:bg-indigo-700" onclick="fetchBook.editBook(${index})">Edit</button>
                  <button class="border w-full p-1 bg-red-500 text-white hover:bg-red-700" onclick="fetchBook.deleteBook(${index})">Delete</button>
              </td>
          </tr>
      `;
  }

  // Method to show confirmation modal before deletion
  showDeleteConfirmationModal(index: number): void {
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
    confirmDeleteMessage.textContent = `Are you sure you want to delete the book titled "${this.bookList[index].title}"?`;

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
  deleteBookConfirmed(index: number): void {
    this.bookList.splice(index, 1);
    this.updateTableData(this.bookList);
    this.totalBookCount();
    this.showModal('Book Deleted Successfully');
  }
  // Method to delete specific book from the table
  deleteBook(index: number): void {
    this.showDeleteConfirmationModal(index);
  }

  // Method to edit a specific book
  editBook(index: number): void {
    const book = this.bookList[index];
    this.cachedFormData = { ...book };
    this.setForm(book);
    this.editIndex = index;
    this.updateSubmitButton('Update Book');
  }
  // Method to count books in table
  totalBookCount() {
    const displayTotalBook = document.getElementById(
      'total-iteam',
    ) as HTMLElement;
    displayTotalBook.innerHTML = `Total Books: ${this.bookList.length}`;
  }

  // Method to set form data
  setForm(data: formData): void {
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

  // Method to filter books by genre
  filterGenre(event: Event): void {
    const selectedGenre = (event.target as HTMLSelectElement).value
      .trim()
      .toLowerCase();
    const filteredBooks = selectedGenre
      ? this.bookList.filter(
          (book) => book.genre.toLowerCase() === selectedGenre,
        )
      : this.bookList;
    this.updateTableData(filteredBooks);
  }

  // Method to sort books by title
  sortBook(): void {
    const sortBy = this.sortBy!.value;
    const sortBtn = this.sortBtn!.value;
    const sortedBooks = this.sortBooks(sortBy, sortBtn);
    this.updateTableData(sortedBooks);
  }

  sortBooks(sortBy: string, sortBtn: string): formData[] {
    const sortedBooks = [...this.bookList];
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

  // method to calculate discount
  discountCalculation(price: number, discountedPrice: number): string {
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
