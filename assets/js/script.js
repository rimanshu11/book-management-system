let form = document.getElementById('formData');
let formData = [];
let editIndex = null;

// validation of data from form...
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const isbn = document.getElementById('isbn').value.trim();
  const publicationDate = document
    .getElementById('publicationDate')
    .value.trim();
  const genre = document.getElementById('genre').value.trim();

  if (!title || !author || !isbn || !publicationDate || !genre) {
    alert('All fields are Required!');
    return;
  } else if (isNaN(isbn) || isbn.length !== 13) {
    alert('ISBN must be 13 digits');
    return;
  }

  const bookAge = calculateBookAge(publicationDate); // calling book age calculation function

  if (editIndex !== null) {
    formData[editIndex] = {
      title,
      author,
      isbn,
      publicationDate,
      genre,
      bookAge,
    };
    editIndex = null;
  } else {
    formData.push({ title, author, isbn, publicationDate, genre, bookAge });
    alert('Book Updating Successfully');
  }
  console.log('formdata after add', formData);

  updateTableData(formData); //passing data from form to updateTableData function for display
  form.reset();
});

// Function to calculate the age of book...

const calculateBookAge = (publicationDate) => {
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
};

// Function to display and update the table...

const updateTableData = (books) => {
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
    isbn.textContent = data.isbn[0].identifier || data.isbn;
    row.appendChild(isbn);

    const pDate = document.createElement('td');
    const fetchPublishDate = data.publicationDate;
    pDate.setAttribute('class', 'border');
    pDate.textContent = fetchPublishDate;
    const calculateFetchBookAge = calculateBookAge(fetchPublishDate);
    row.appendChild(pDate);

    const genre = document.createElement('td');
    genre.setAttribute('class', 'border');
    genre.textContent = data.genre;
    row.appendChild(genre);

    const bookAge = document.createElement('td');
    bookAge.setAttribute('class', 'border');
    bookAge.textContent = calculateFetchBookAge; // Use calculated age here
    row.appendChild(bookAge);

    const action = document.createElement('td');
    action.setAttribute('class', "border")

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'w-full border font-semibold p-1 bg-red-600 text-white hover:bg-red-800');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteBook(index);
    action.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.setAttribute('class', 'w-full border font-semibold p-1 bg-blue-600 text-white hover:bg-blue-800');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editBook(index);
    action.appendChild(editButton);

    row.appendChild(action);
    tableBody.appendChild(row);
  });
};

// Function to delete listed data...

const deleteBook = (index) => {
  formData.splice(index, 1);
  updateTableData(formData);
  alert('Book Delete Successfully');
  form.reset();
};

// Function to edit listed data...

const editBook = (index) => {
  const book = formData[index];
  console.log(book);

  document.getElementById('title').value = book.title;
  document.getElementById('author').value = book.author;
  document.getElementById('isbn').value = book.isbn;
  document.getElementById('publicationDate').value = book.publicationDate;
  document.getElementById('genre').value = book.genre;
  editIndex = index;
};

// Function to filter data based on genre...

document.getElementById('genreFilter').addEventListener('change', filterGenre);
function filterGenre(e) {
  const selectedGenre = this.value;
  const filteredFormData = selectedGenre
    ? formData.filter(
        (book) => book.genre.toLowerCase() === selectedGenre.toLowerCase()
      )
    : formData;
  updateTableData(filteredFormData);
}