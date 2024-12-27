class Book {
  constructor() {
    this.form = document.getElementById('formData');
    this.bookList = [];
    this.editIndex = null;
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    const genreFilter = document.getElementById('genreFilter');
    genreFilter.addEventListener('change', this.filterGenre.bind(this));
  }
  // method to handle form on submit...
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
      this.bookList[this.editIndex] = {
        title,
        author,
        isbn,
        publicationDate,
        genre,
        bookAge,
      };
      this.editIndex = null;
      alert('Book Edit Successfully!')
      this.form.reset()
    } else {
      this.bookList.push({ title, author, isbn, publicationDate, genre, bookAge });
      this.form.reset();
      alert('Book Added Successfully');
    }
    this.updateTableData(this.bookList);
  }

// method to calculate the age of the book...

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


// method to update the table data after fetching or add book...

  updateTableData(books) {
    const tableBody = document.querySelector('#tableData tbody');
    tableBody.innerHTML = '';

    books.forEach((data, index) => {
      const row = document.createElement('tr');
      row.setAttribute('class', 'text-center even:bg-gray-200 odd:bg-white');

      const author = document.createElement('td');
      author.setAttribute('class', 'border');
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


  // method to delete specific book from the table...

  deleteBook(index) {
    this.bookList.splice(index, 1);
    console.log('After Delete:', this.bookList);
    this.updateTableData(this.bookList);
    alert('Book Deleted Successfully');
  }

// method to edit a specific book...

  editBook(index) {
    const book = this.bookList[index];
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('publicationDate').value = book.publicationDate;
    document.getElementById('genre').value = book.genre;
    this.editIndex = index;
  }


  // method to categories book based on genre...
  filterGenre(event) {
    const selectedGenre = event.target.value.trim().toLowerCase();
    const filteredBooks = selectedGenre ? this.bookList.filter(book => book.genre.toLowerCase() === selectedGenre)
      : this.bookList;
    this.updateTableData(filteredBooks);
  }
}

const book = new Book();
