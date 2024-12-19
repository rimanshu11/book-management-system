let form = document.getElementById("formData");
const formData = [];
let editIndex = null;

form.addEventListener('submit', (e) => {
  e.preventDefault();
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

  const bookAge = calculateBookAge(publicationDate);
  console.log("Book Age", bookAge);

  if (editIndex !== null) {
    formData[editIndex] = { title, author, isbn, publicationDate, genre, bookAge };
    editIndex = null;
  } else {
    formData.push({ title, author, isbn, publicationDate, genre, bookAge });
  }

  updateTableData(formData);
  form.reset();
});

const calculateBookAge = (publicationDate) => {
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

const updateTableData = (books) => {
  const tableBody = document.querySelector("#tableData tbody");
  tableBody.innerHTML = '';
  books.forEach((data, index) => {
    const row = document.createElement('tr');

    const title = document.createElement('td');
    title.textContent = data.title;
    row.appendChild(title);

    const author = document.createElement('td');
    author.textContent = data.author;
    row.appendChild(author);

    const isbn = document.createElement('td');
    isbn.textContent = data.isbn;
    row.appendChild(isbn);

    const pDate = document.createElement('td');
    pDate.textContent = data.publicationDate;
    row.appendChild(pDate);

    const genre = document.createElement('td');
    genre.textContent = data.genre;
    row.appendChild(genre);

    const bookAge = document.createElement('td');
    bookAge.textContent = data.bookAge;
    row.appendChild(bookAge);


    const action = document.createElement('td');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteBook(index);
    action.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editBook(index);
    action.appendChild(editButton);

    row.appendChild(action);
    tableBody.appendChild(row);
  });
}

const deleteBook = (index) => {
  formData.splice(index, 1); 
  updateTableData();
}

const editBook = (index) => {
  const book = formData[index];

  document.getElementById('title').value = book.title;
  document.getElementById('author').value = book.author;
  document.getElementById('isbn').value = book.isbn;
  document.getElementById('publicationDate').value = book.publicationDate;
  document.getElementById('genre').value = book.genre;

  editIndex = index;
}

document.getElementById('genreFilter').addEventListener('change', filterGenre);
function filterGenre(e){
    const selectedGenre = this.value;
    const filterdFormData = selectedGenre ? formData.filter(book=>
      book.genre == selectedGenre
    )   : formData
    // console.log("Filterd form data",filterdFormData);
    updateTableData(filterdFormData)
}