"use strict";
class Book {
    form;
    bookList;
    editIndex;
    cachedFormData;
    constructor() {
        this.form = document.getElementById('formData');
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
            bookAge: ''
        }; // Ensuring initial structure
        this.bindEvents();
    }
    // Bind all event listeners
    bindEvents() {
        this.form?.addEventListener('submit', this.handleFormSubmit.bind(this));
        document.querySelector('[type="reset"]')?.addEventListener('click', this.handleFormReset.bind(this));
        document.getElementById('genreFilter')?.addEventListener('change', this.filterGenre.bind(this));
        document.getElementById('sortBtn')?.addEventListener('change', this.sortBook.bind(this));
    }
    // Method to handle form reset
    handleFormReset() {
        this.editIndex = null;
        const isbnInput = document.getElementById('isbn');
        isbnInput.disabled = false;
        this.form?.reset();
        this.updateSubmitButton('Add Book');
        const errorFields = ['title-error', 'author-error', 'isbn-error', 'publicationDate-error', 'price-error', 'discountPrice-error', 'genre-error'];
        errorFields.forEach(field => this.toggleError(field));
    }
    // Method to show modal with a message
    showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        const closeModalBtn = document.getElementById('closeModalBtn');
        // Set the message and display the modal
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
        // Close modal when the button is clicked
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    // Method to handle form submission
    handleFormSubmit(event) {
        event.preventDefault();
        this.cachedFormData = this.getFormData();
        if (!this.validateForm())
            return;
        const { title, author, isbn, publicationDate, price, discountPrice, genre } = this.cachedFormData;
        const bookAge = this.calculateBookAge(publicationDate).trim();
        if (bookAge) {
            if (this.editIndex !== null) {
                this.bookList[this.editIndex] = { ...this.bookList[this.editIndex], title, author, publicationDate, price, discountPrice, genre, bookAge };
                this.editIndex = null;
                this.handleFormReset();
                this.showModal('Book Edited Successfully!');
            }
            else {
                this.bookList.push({ title, author, isbn, publicationDate, price, discountPrice, genre, bookAge });
                this.handleFormReset();
                this.showModal('Book Added Successfully');
            }
        }
        this.updateTableData(this.bookList);
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
            bookAge: ''
        };
    }
    // Validate the form inputs using cached data
    validateForm() {
        const { title, author, isbn, publicationDate, price, discountPrice, genre } = this.cachedFormData;
        let isValid = true;
        const fields = { title, author, isbn, publicationDate, genre };
        Object.entries(fields).forEach(([field, value]) => {
            if (!value) {
                this.toggleError(`${field}-error`, `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
                isValid = false;
            }
            else {
                this.toggleError(`${field}-error`);
            }
        });
        if (price <= 0 || isNaN(price)) {
            this.toggleError('price-error', 'Price must be a valid positive number.');
            isValid = false;
        }
        else {
            this.toggleError('price-error');
        }
        if (discountPrice < 0 || isNaN(discountPrice)) {
            this.toggleError('discountPrice-error', 'Discount price must be a valid number.');
            isValid = false;
        }
        else {
            this.toggleError('discountPrice-error');
        }
        if (discountPrice > price) {
            this.toggleError('discountPrice-error', 'Discount price cannot be higher than price.');
            isValid = false;
        }
        else {
            this.toggleError('discountPrice-error');
        }
        if (isNaN(Number(isbn)) || isbn.length !== 13) {
            this.toggleError('isbn-error', 'ISBN must be 13 digits.');
            isValid = false;
        }
        else {
            this.toggleError('isbn-error');
        }
        return isValid;
    }
    // method to show or hide error messages
    toggleError(fieldId, message = '') {
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
    // Method to calculate the age of the book
    calculateBookAge(publicationDate) {
        const currentDate = new Date();
        const pubDate = new Date(publicationDate);
        const ageInYears = currentDate.getFullYear() - pubDate.getFullYear();
        const ageInMonths = currentDate.getMonth() - pubDate.getMonth();
        const ageInDays = currentDate.getDate() - pubDate.getDate();
        if (currentDate < pubDate) {
            alert("Wrong publication date!");
            return '';
        }
        let ageText = ageInYears > 0 ? `${ageInYears} year(s)` :
            ageInMonths > 0 ? `${ageInMonths} month(s)` :
                ageInDays > 0 ? `${ageInDays} day(s)` :
                    `Less than a day old`;
        return ageText;
    }
    // Update submit button text for editing or adding
    updateSubmitButton(text) {
        document.querySelector('[type="submit"]').textContent = text;
    }
    // Method to update the table data after adding/editing a book
    updateTableData(books) {
        const tableBody = document.querySelector('#tableData tbody');
        tableBody.innerHTML = '';
        const rows = books.map((book, index) => this.createTableRow(book, index));
        tableBody.insertAdjacentHTML('beforeend', rows.join(''));
    }
    // Create table row for each book
    createTableRow(book, index) {
        return `
            <tr class="border text-center even:bg-gray-200 odd:bg-white">
                <td class="border">${book.author}</td>
                <td class="border">${book.title}</td>
                <td class="border">${book.isbn}</td>
                <td class="border">${book.publicationDate}</td>
                <td class="border">${book.genre}</td>
                <td class="border">${this.discountCalculation(book.price, book.discountPrice)}</td>
                <td class="border">${book.bookAge}</td>
                <td class="border">
                    <button class="border w-full p-1 bg-indigo-500 text-white hover:bg-indigo-700" onclick="fetchBook.editBook(${index})">Edit</button>
                    <button class="border w-full p-1 bg-red-500 text-white hover:bg-red-700" onclick="fetchBook.deleteBook(${index})">Delete</button>
                </td>
            </tr>
        `;
    }
    // Method to show confirmation modal before deletion
    showDeleteConfirmationModal(index) {
        const confirmDeleteModal = document.getElementById('confirmDeleteModal');
        const confirmDeleteMessage = document.getElementById('confirmDeleteMessage');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
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
    deleteBookConfirmed(index) {
        this.bookList.splice(index, 1);
        this.updateTableData(this.bookList);
        this.showModal('Book Deleted Successfully');
    }
    // Method to delete specific book from the table
    deleteBook(index) {
        this.showDeleteConfirmationModal(index);
    }
    // Method to edit a specific book
    editBook(index) {
        const book = this.bookList[index];
        this.cachedFormData = { ...book };
        this.setForm(book);
        this.editIndex = index;
        this.updateSubmitButton('Update Book');
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
            genre: document.getElementById('genre')
        };
        formElements.title.value = data.title;
        formElements.author.value = data.author;
        formElements.isbn.value = data.isbn;
        formElements.isbn.disabled = true;
        formElements.publicationDate.value = data.publicationDate;
        formElements.listPrice.value = data.price.toString();
        formElements.discountPrice.value = data.discountPrice.toString();
        const genreSelect = formElements.genre;
        const genreOptions = Array.from(genreSelect.options).map(option => option.value.toLowerCase());
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
    filterGenre(event) {
        const selectedGenre = event.target.value.trim().toLowerCase();
        const filteredBooks = selectedGenre ? this.bookList.filter(book => book.genre.toLowerCase() === selectedGenre) : this.bookList;
        this.updateTableData(filteredBooks);
    }
    // Method to sort books by title
    sortBook(event) {
        const sortBy = event.target.value;
        const sortedBooks = this.sortBooks(sortBy);
        this.updateTableData(sortedBooks);
    }
    // method for sorting books
    sortBooks(sortBy) {
        const sortedBooks = [...this.bookList];
        const direction = sortBy === 'dsc' ? -1 : 1;
        sortedBooks.sort((a, b) => direction * a.title.localeCompare(b.title));
        return sortedBooks;
    }
    // method to calculate discount
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
            if ((price === discountedPrice) || (discountedPrice === 0)) {
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
}
