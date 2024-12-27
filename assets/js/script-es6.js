class BookForm {
    constructor() {
      this.form = document.getElementById('formData');
      this.formData = [];
      this.editIndex = null;
  
      // Bind methods to the class instance
      this.initialize();
    }

    // Initialize event listeners and other setup tasks
    initialize() {
      this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
      document.getElementById('genreFilter').addEventListener('change', this.filterGenre.bind(this));
      document.getElementById('sortBtn').addEventListener('change', this.sortBook.bind(this));
    }
  
    // Handle form submit event
    handleFormSubmit(e) {
      e.preventDefault();
  
      const title = document.getElementById('title').value.trim();
      const author = document.getElementById('author').value.trim();
      const isbn = document.getElementById('isbn').value.trim();
      const publicationDate = document.getElementById('publicationDate').value.trim();
      const genre = document.getElementById('genre').value.trim();
  
      if (!title || !author || !isbn || !publicationDate || !genre) {
        alert('All fields are Required!');
        return;
      } else if (isNaN(isbn) || isbn.length !== 13) {
        alert('ISBN must be 13 digits');
        return;
      }
  
      const bookAge = this.calculateBookAge(publicationDate);
  
      if (this.editIndex !== null) {
        this.formData[this.editIndex] = { title, author, isbn, publicationDate, genre, bookAge };
        this.editIndex = null;
      } else {
        this.formData.push({ title, author, isbn, publicationDate, genre, bookAge });
        alert('Book Added Successfully');
      }
  
      this.updateTableData();
      this.form.reset();
    }
  
    // Calculate the age of a book based on the publication date
    calculateBookAge(publicationDate) {
      const currentDate = new Date();
      const pubDate = new Date(publicationDate);
      let ageText = '';
  
      if (currentDate < pubDate) {
        alert('Wrong publication date!');
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
  
    // Update the table data based on the formData array
    updateTableData() {
      const tableBody = document.querySelector('#tableData tbody');
      tableBody.innerHTML = '';
  
      this.formData.forEach((data, index) => {
        const row = document.createElement('tr');
        row.setAttribute('class', 'text-center even:bg-gray-200 odd:bg-white');
  
        // Create and append columns for book details
        row.appendChild(this.createTableCell(data.author));
        row.appendChild(this.createTableCell(data.title));
        row.appendChild(this.createTableCell(data.isbn));
        row.appendChild(this.createTableCell(data.publicationDate));
        row.appendChild(this.createTableCell(data.genre));
        row.appendChild(this.createTableCell(this.calculateBookAge(data.publicationDate)));
  
        // Create and append action buttons
        const actionCell = document.createElement('td');
        actionCell.setAttribute('class', 'border');
  
        actionCell.appendChild(this.createButton('Delete', () => this.deleteBook(index), 'bg-red-600'));
        actionCell.appendChild(this.createButton('Edit', () => this.editBook(index), 'bg-blue-600'));
  
        row.appendChild(actionCell);
        tableBody.appendChild(row);
      });
    }
  
    // Create a table cell
    createTableCell(content) {
      const cell = document.createElement('td');
      cell.setAttribute('class', 'border');
      cell.textContent = content;
      return cell;
    }
  
    // Create a button
    createButton(text, onClickHandler, bgColor) {
      const button = document.createElement('button');
      button.setAttribute('class', `w-full border font-semibold p-1 ${bgColor} text-white hover:bg-opacity-80`);
      button.textContent = text;
      button.onclick = onClickHandler;
      return button;
    }
  
    // Delete a book from the list
    deleteBook(index) {
      this.formData.splice(index, 1);
      this.updateTableData();
      alert('Book Deleted Successfully');
    }
  
    // Edit a book's data
    editBook(index) {
      const book = this.formData[index];
      document.getElementById('title').value = book.title;
      document.getElementById('author').value = book.author;
      document.getElementById('isbn').value = book.isbn;
      document.getElementById('publicationDate').value = book.publicationDate;
      document.getElementById('genre').value = book.genre;
      this.editIndex = index;
    }
  
    // Filter books by genre
    filterGenre(e) {
      const selectedGenre = e.target.value;
      const filteredData = selectedGenre
        ? this.formData.filter((book) => book.genre.toLowerCase() === selectedGenre.toLowerCase())
        : this.formData;
      this.updateTableData(filteredData);
    }
  
    // Sort books by title
    sortBook() {
      const sortBy = document.getElementById('sortBtn').value;
      const sortedData = this.formData.sort((a, b) => {
        return sortBy === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      });
      this.updateTableData(sortedData);
    }
  }
  
  // Instantiate the BookForm class when the document is ready
  document.addEventListener('DOMContentLoaded', () => {
    new BookForm();
  });
  