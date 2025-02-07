
class Book {
    constructor() {
        this.form = document.getElementById('formData');
        this.bookList = [];
        this.editIndex = null;
        this.cachedFormData = {}; 
        this.bindEvents();
    }

    // Bind all event listeners
    bindEvents() {
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        document.querySelector('[type="reset"]').addEventListener('click', this.handleFormReset.bind(this));
        document.getElementById('genreFilter').addEventListener('change', this.filterGenre.bind(this));
        document.getElementById('sortBtn').addEventListener('change', this.sortBook.bind(this));
    }

    // Method to handle form reset
    handleFormReset() {
        this.editIndex = null;
        document.getElementById('isbn').disabled = false;
        this.form.reset();
        this.updateSubmitButton('Add Book');
        const errorFields = ['title-error', 'author-error', 'isbn-error', 'publicationDate-error', 'price-error', 'discountPrice-error', 'genre-error'];
        errorFields.forEach(field => this.toggleError(field)); 
    }


    // Method to handle form submission
    handleFormSubmit(event) {
        event.preventDefault();
        this.cachedFormData = this.getFormData();
        if (!this.validateForm()) return;

        const { title, author, isbn, publicationDate, price, discountPrice, genre } = this.cachedFormData;
        const bookAge = this.calculateBookAge(publicationDate).trim();
        if(bookAge){
            if (this.editIndex !== null) {
                this.bookList[this.editIndex] = { ...this.bookList[this.editIndex], title, author, publicationDate, price, discountPrice, genre, bookAge };
                this.editIndex = null;
                this.handleFormReset();
                alert('Book Edited Successfully!');
            } else {
                    this.bookList.push({ title, author, isbn, publicationDate, price, discountPrice, genre, bookAge });
                    this.handleFormReset();
                    alert('Book Added Successfully');
            }
        }
        this.updateTableData(this.bookList);
    }

    // Get form data and return as an object (only when needed)
    getFormData() {
        return {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            isbn: document.getElementById('isbn').value.trim(),
            publicationDate: document.getElementById('publicationDate').value.trim(),
            price: Number(document.getElementById("listPrice").value.trim()),
            discountPrice: Number(document.getElementById("discountPrice").value.trim()),
            genre: document.getElementById('genre').value.trim()
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
            this.toggleError('discountPrice-error', 'Discount price must be a valid number.');
            isValid = false;
        } else {
            this.toggleError('discountPrice-error');
        }

        if (discountPrice > price) {
            this.toggleError('discountPrice-error', 'Discount price cannot be higher than price.');
            isValid = false;
        } else {
            this.toggleError('discountPrice-error');
        }

        if (isNaN(isbn) || isbn.length !== 13) {
            this.toggleError('isbn-error', 'ISBN must be 13 digits.');
            isValid = false;
        } else {
            this.toggleError('isbn-error'); 
        }

        return isValid;
    }


    // Show or hide error messages based on the presence of the message argument
    toggleError(fieldId, message = '') {
        const errorElement = document.getElementById(fieldId);
        if (message) {
            errorElement.textContent = message; 
            errorElement.classList.remove('hidden'); 
        } else {
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

    // Method to delete specific book from the table
    deleteBook(index) {
        if (confirm('Want to Delete?')) {
            this.bookList.splice(index, 1);
            this.updateTableData(this.bookList);
            alert('Book Deleted Successfully');
        }
    }

    // Method to edit a specific book
    editBook(index) {
        const book = this.bookList[index];
        this.cachedFormData = { ...book };
        // Populate the form with the cached data
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn;
        document.getElementById('isbn').disabled = true;
        document.getElementById('publicationDate').value = book.publicationDate;
        document.getElementById('listPrice').value = book.price;
        document.getElementById('discountPrice').value = book.discountPrice;
        document.getElementById('genre').value = book.genre;
        document.getElementById('title').focus();

        this.editIndex = index;
        this.updateSubmitButton('Update Book');
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
  

    // Discount calculation logic
    discountCalculation(price, discountedPrice) {
        if( price == undefined && discountedPrice == undefined){
          price=0;
          discountedPrice=0;
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
        }else {
          if (price === discountedPrice) {
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
