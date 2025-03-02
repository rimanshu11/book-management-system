import { Utils } from "./utils.js";
export class BookManager {
    bookStore;
    formhandler;
    showTable;
    bookManagerHelper;
    toggleEvent;
    constructor(utils, formhandler, bookStore, showTable, bookManagerHelper) {
        this.formhandler = formhandler;
        this.bookStore = bookStore;
        this.showTable = showTable;
        this.bookManagerHelper = bookManagerHelper;
        this.toggleEvent = false;
    }
    toggleBindEvent(value) {
        this.toggleEvent = value;
        this.bindEvents();
    }
    bindEvents() {
        const genreFilter = document.getElementById('genreFilter');
        document.getElementById('resetForm')?.addEventListener('click', () => {
            this.formhandler.handleFormReset();
        });
        genreFilter?.addEventListener('change', this.filterGenre.bind(this));
        this.bookManagerHelper.toggleSortBtn();
    }
    // public bindTableEvents(): void {
    //   console.log('Buttons: ', document.querySelectorAll('[id^="editBtn-"]'));
    //   document.querySelectorAll('button[id^="editBtn-"]').forEach((btn) => {
    //     const index = parseInt((btn as HTMLElement).id.split('-')[1]);
    //     btn.addEventListener('click', () => this.editBook(index));
    //   });
    //   document.querySelectorAll('button[id^="deleteBtn-"]').forEach((btn) => {
    //     const index = parseInt((btn as HTMLElement).id.split('-')[1]);
    //     btn.addEventListener('click', () => this.deleteBook(index));
    //   });
    //   this.toggleSortBtn();
    // }
    updateSubmitButton(text) {
        document.querySelector('[type="submit"]').textContent = text;
    }
    showDeleteConfirmationModal(index) {
        const confirmDeleteModal = document.getElementById('confirmDeleteModal');
        const confirmDeleteMessage = document.getElementById('confirmDeleteMessage');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
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
    deleteBookConfirmed(index) {
        this.bookStore.bookList.splice(index, 1);
        this.showTable.updateTableData(this.bookStore.bookList);
        // this.bindTableEvents();
        this.bookStore.totalBookCount();
        Utils.showModal('Book Deleted Successfully');
    }
    deleteBook(index) {
        console.log(`Deleting book at index: ${index}`);
        this.showDeleteConfirmationModal(index);
    }
    editBook(index) {
        const book = this.bookStore.bookList[index];
        this.formhandler.cachedFormData = { ...book };
        this.setForm(book);
        this.formhandler.editIndex = index;
        this.updateSubmitButton('Update Book');
    }
    filterGenre(event) {
        const selectedGenre = event.target.value
            .trim()
            .toLowerCase();
        const filteredBooks = selectedGenre
            ? this.bookStore.bookList.filter((book) => book.genre.toLowerCase() === selectedGenre)
            : this.bookStore.bookList;
        this.showTable.updateTableData(filteredBooks);
        // this.bindTableEvents();
    }
    discountCalculation(price, discountedPrice) {
        if (price === undefined && discountedPrice === undefined) {
            price = 0;
            discountedPrice = 0;
            if (price === discountedPrice) {
                return `<span class="text-green-500 font-bold">${price.toFixed()} /-</span>`;
            }
            else {
                const percentage = (discountedPrice / price) * 100;
                const discountPercentage = (100 - percentage).toFixed();
                return `
          <span class="line-through text-red-500 font-semibold">${price.toFixed()} rs/-</span>
          <span class="text-green-600 font-bold">(${discountPercentage}% Off)</span><br>
          <span class=" text-blue-600  font-semibold">${discountedPrice.toFixed()} rs/-</span>
        `;
            }
        }
        else {
            if (price === discountedPrice || discountedPrice === 0) {
                return `<span class="text-green-500 font-bold">${price.toFixed()} rs/-</span>`;
            }
            else {
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
    // Method to set form data
    setForm(data) {
        const formElements = {
            title: document.getElementById('title'),
            author: document.getElementById('author'),
            isbn: document.getElementById('isbn'),
            publicationDate: document.getElementById('publicationDate'),
            listPrice: document.getElementById('listPrice'),
            discountPrice: document.getElementById('discountPrice'),
            genre: document.getElementById('genre'),
        };
        formElements.title.value = data.title;
        formElements.author.value = data.author;
        formElements.isbn.value = data.isbn;
        formElements.isbn.disabled = true;
        formElements.publicationDate.value = data.publicationDate;
        formElements.listPrice.value = data.price.toString();
        formElements.discountPrice.value = data.discountPrice.toString();
        const genreSelect = formElements.genre;
        const genreOptions = Array.from(genreSelect.options).map((option) => option.value.toLowerCase());
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
