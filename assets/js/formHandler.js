import { Utils } from './utils.js';
export class FormHandler {
    form;
    utils;
    book;
    cachedFormData;
    editIndex;
    bookList;
    constructor(utils) {
        this.form = document.getElementById('formData');
        this.utils = utils;
        this.book = null;
        this.editIndex = null;
        this.bookList = [];
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
        this.bindFormHandler();
    }
    setBookInstance(book) {
        this.book = book;
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
        const bookAge = this.calculateBookAge(publicationDate).trim();
        if (bookAge) {
            if (this.editIndex !== null) {
                // Editing a book
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
                Utils.showModal('Book Edited Successfully!');
            }
            else {
                // Adding a new book
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
                Utils.showModal('Book Added Successfully');
            }
            // Update the table data
            this.book?.updateTableData(this.bookList);
            // Rebind events to the table rows
            // this.book?.bindEvents();
            this.handleFormReset();
            // Update total book count
            this.book?.totalBookCount();
        }
    }
    // Method to calculate the age of the book
    calculateBookAge(publicationDate) {
        const currentDate = new Date();
        const pubDate = new Date(publicationDate);
        const ageInYears = currentDate.getFullYear() - pubDate.getFullYear();
        const ageInMonths = currentDate.getMonth() - pubDate.getMonth();
        const ageInDays = currentDate.getDate() - pubDate.getDate();
        if (currentDate < pubDate) {
            Utils.toggleError("publicationDate-error", "Future dates are not permissible. Please choose a valid date");
            return '';
        }
        let ageText = ageInYears > 0
            ? `${ageInYears} year(s)`
            : ageInMonths > 0
                ? `${ageInMonths} month(s)`
                : ageInDays > 0
                    ? `${ageInDays} day(s)`
                    : `Less than a day old`;
        return ageText;
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
