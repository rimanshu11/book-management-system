import { Utils } from './utils.js';
export class FormHandler {
    bookStore;
    bookManagerHelper;
    form;
    cachedFormData;
    editIndex;
    constructor(bookStore, bookManagerHelper) {
        this.bookStore = bookStore;
        this.bookManagerHelper = bookManagerHelper;
        this.form = document.getElementById('formData');
        this.bookManagerHelper = bookManagerHelper;
        this.bookStore = bookStore;
        this.editIndex = null;
        this.cachedFormData = {
            title: '',
            author: '',
            isbn: '',
            publicationDate: '',
            price: 0,
            discountPrice: 0,
            discountedPrice: '',
            genre: '',
            bookAge: '',
        };
        this.bindFormHandler();
    }
    bindFormHandler() {
        this.form?.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
    // Method to handle form reset
    handleFormReset() {
        this.editIndex = null;
        const isbnInput = document.getElementById('isbn');
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
        errorFields.forEach((field) => Utils.toggleError(field));
    }
    // Update submit button text for editing or adding
    updateSubmitButton(text) {
        document.querySelector('[type="submit"]').textContent = text;
    }
    // Method to handle form submission
    handleFormSubmit(event) {
        event.preventDefault();
        this.cachedFormData = this.getFormData();
        if (!this.validateForm())
            return;
        const { title, author, isbn, publicationDate, price, discountPrice, genre, } = this.cachedFormData;
        const bookAge = this.bookManagerHelper.calculateBookAge(publicationDate).trim();
        if (bookAge) {
            // if editIndex is not null, then edit the book
            if (this.editIndex !== null) {
                this.bookStore.bookList[this.editIndex] = {
                    ...this.bookStore.bookList[this.editIndex],
                    title,
                    author,
                    publicationDate,
                    price,
                    discountPrice,
                    discountedPrice: this.bookManagerHelper.discountCalculation(price, discountPrice),
                    genre,
                    bookAge,
                };
                this.editIndex = null;
                Utils.showModal('Book Edited Successfully!');
            }
            else {
                // Adding a new book
                this.bookStore.bookList.unshift({
                    title,
                    author,
                    isbn,
                    publicationDate,
                    price,
                    discountPrice,
                    discountedPrice: this.bookManagerHelper.discountCalculation(price, discountPrice),
                    genre,
                    bookAge,
                });
                this.bookManagerHelper.toggleSortBtn();
                Utils.showModal('Book Added Successfully');
            }
            this.bookStore.displayBooksData();
            this.handleFormReset();
            this.bookStore.totalBookCount();
        }
    }
    // Get form data and return as an object
    getFormData() {
        return {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            isbn: document.getElementById('isbn').value.trim(),
            publicationDate: document.getElementById('publicationDate').value.trim(),
            price: Number(document.getElementById('listPrice').value.trim()),
            discountPrice: Number(document.getElementById('discountPrice').value.trim()),
            genre: document.getElementById('genre').value.trim(),
            bookAge: '',
        };
    }
    // Validate the form inputs using cached data
    validateForm() {
        const { title, author, isbn, publicationDate, price, discountPrice, genre, } = this.cachedFormData;
        let isValid = true;
        const fields = { title, author, isbn, publicationDate, genre };
        Object.entries(fields).forEach(([field, value]) => {
            if (!value) {
                Utils.toggleError(`${field}-error`, `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
                isValid = false;
            }
            else {
                Utils.toggleError(`${field}-error`);
            }
        });
        if (price <= 0 || isNaN(price)) {
            Utils.toggleError('price-error', 'Price must be a valid positive number.');
            isValid = false;
        }
        else {
            Utils.toggleError('price-error');
        }
        if (discountPrice < 0 || isNaN(discountPrice)) {
            Utils.toggleError('discountPrice-error', 'Discount price must be a valid number.');
            isValid = false;
        }
        else {
            Utils.toggleError('discountPrice-error');
        }
        if (discountPrice > price) {
            Utils.toggleError('discountPrice-error', 'Discount price cannot be higher than price.');
            isValid = false;
        }
        else {
            Utils.toggleError('discountPrice-error');
        }
        if (isNaN(Number(isbn)) || isbn.length !== 13) {
            Utils.toggleError('isbn-error', 'ISBN must be 13 digits.');
            isValid = false;
        }
        else {
            Utils.toggleError('isbn-error');
        }
        return isValid;
    }
}
