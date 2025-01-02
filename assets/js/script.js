class Book {
  constructor() {
    this.form = document.getElementById('formData');
    this.bookList = [];
    this.editIndex = null;
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));

    // Add the reset button functionality
    const resetBtn = document.querySelector('[type="reset"]');
    resetBtn.addEventListener('click', this.handleFormReset.bind(this));

    const genreFilter = document.getElementById('genreFilter');
    genreFilter.addEventListener('change', this.filterGenre.bind(this));

    const sortBtn = document.getElementById('sortBtn');
    sortBtn.addEventListener('change', this.sortBook.bind(this)); // Correctly adding the event listener
  }

  // Method to handle form reset
  handleFormReset() {
    const addBtn = document.querySelector('[type="submit"]');
    addBtn.textContent = 'Add Book'; 
    this.editIndex = null;
    this.form.reset();
  }

  // Method to handle form on submit
  handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const isbn = document.getElementById('isbn').value.trim();
    const publicationDate = document.getElementById('publicationDate').value.trim();
    const genre = document.getElementById('genre').value.trim();

    if (!title || !author || !isbn || !publicationDate || !genre) {
        alert("All fields are Required!");
        return;
    } else if (isNaN(isbn) || isbn.length !== 13) {
        alert("ISBN must be 13 digits");
        return;
    }

    const bookAge = this.calculateBookAge(publicationDate);
    if (this.editIndex !== null) {
        // Update only the editable fields: title, author, publicationDate, genre
        this.bookList[this.editIndex] = {
            ...this.bookList[this.editIndex], // Keep the other fields (ISBN, bookAge) intact
            title,
            author,
            publicationDate,
            genre,
            bookAge, // Recalculate book age (optional if you want to recalculate)
        };
        this.editIndex = null;
        this.handleFormReset();
        alert('Book Edited Successfully!');
        
    } else {
        this.bookList.push({ title, author, isbn, publicationDate, genre, bookAge,   });
        this.form.reset();
        alert('Book Added Successfully');
    }

    // Enable the ISBN field again after submitting the form (for new books)
    document.getElementById('isbn').disabled = false;

    this.updateTableData(this.bookList);
  }


  // Method to calculate the age of the book
  calculateBookAge(publicationDate) {
    const currentDate = new Date();
    const pubDate = new Date(publicationDate);
    let ageText = '';
    if (currentDate < pubDate) {
      alert("Wrong publication date!");
      return;
    } else {
      const ageInYears = currentDate.getFullYear() - pubDate.getFullYear();
      const ageInMonths = currentDate.getMonth() - pubDate.getMonth();
      const ageInDays = currentDate.getDate() - pubDate.getDate();

      if (ageInYears > 0) {
        ageText = `${ageInYears} year(s)`;
      } else if (ageInMonths > 0) {
        ageText = `${ageInMonths} month(s)`;
      } else if (ageInDays > 0) {
        ageText = `${ageInDays} day(s)`;
      } else {
        ageText = `Less than a day old`;
      }
    }
    return ageText;
  }

  // Method to update the table data after adding a book
  updateTableData(books) {
    const tableBody = document.querySelector('#tableData tbody');
    tableBody.innerHTML = '';

    books.forEach((data, index) => {
      const row = document.createElement('tr');
      row.setAttribute('class', 'text-center even:bg-gray-200 odd:bg-white');

      const author = document.createElement('td');
      author.setAttribute('class', 'border font-semibold');
      author.textContent = data.author;
      row.appendChild(author);

      const title = document.createElement('td');
      title.setAttribute('class', 'border');
      title.textContent = data.title;
      row.appendChild(title);

      const isbn = document.createElement('td');
      isbn.setAttribute('class', 'border');
      isbn.textContent = data.isbn;
      row.appendChild(isbn);

      const pDate = document.createElement('td');
      pDate.setAttribute('class', 'border');
      pDate.textContent = data.publicationDate;
      row.appendChild(pDate);

      const genre = document.createElement('td');
      genre.setAttribute('class', 'border');
      genre.textContent = data.genre;
      row.appendChild(genre);

      const price = document.createElement('td');
      price.setAttribute('class', 'border w-full');
      price.innerHTML = this.discountCalculation(data.price, data.discountPrice);
      row.appendChild(price);

      const bookAge = document.createElement('td');
      bookAge.setAttribute('class', 'border');
      bookAge.textContent = data.bookAge;
      row.appendChild(bookAge);

      const action = document.createElement('td');
      action.setAttribute('class', "border");

      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('class', 'w-full border font-semibold p-1 bg-red-600 text-white hover:bg-red-800');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => this.deleteBook(index);
      action.appendChild(deleteButton);

      const editButton = document.createElement('button');
      editButton.setAttribute('class', 'w-full border font-semibold p-1 bg-blue-600 text-white hover:bg-blue-800');
      editButton.textContent = 'Edit';
      editButton.onclick = () => this.editBook(index);
      action.appendChild(editButton);

      row.appendChild(action);
      tableBody.appendChild(row);
    });
  }

  // Method to delete specific book from the table
  deleteBook(index) {
    this.bookList.splice(index, 1);
    console.log('After Delete:', this.bookList);
    this.updateTableData(this.bookList);
    alert('Book Deleted Successfully');
  }

  // Method to edit a specific book
  editBook(index) {
    const book = this.bookList[index];
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('isbn').disabled = book.isbn;
    document.getElementById('publicationDate').value = book.publicationDate;
    document.getElementById('genre').value = book.genre;
    this.editIndex = index;
    const addBtn = document.querySelector('[type="submit"]');
    addBtn.textContent = 'Update Book'; 
    
    document.getElementById('title').focus();
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
    let sortedBook;

    if (sortBy === 'asc') {
      sortedBook = this.bookList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'dsc') {
      sortedBook = this.bookList.sort((a, b) => b.title.localeCompare(a.title));
    } else{
      sortedBook = this.bookList
    }
    this.updateTableData(sortedBook);
  }

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
    }
  }
}
