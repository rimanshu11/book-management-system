let form = document.getElementById("formData");
const formData = [];

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


    formData.push({ title, author, isbn, publicationDate, genre });
  updateTableData(formData);
  form.reset();
});

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
