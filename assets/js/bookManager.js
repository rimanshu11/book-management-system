import { Utils } from "./utils.js";
export class BookManager {
    bookStore;
    formhandler;
    showTable;
    bookManagerHelper;
    toggleEvent;
    constructor(formhandler, bookStore, showTable, bookManagerHelper) {
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
