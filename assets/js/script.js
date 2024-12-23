let form = document.getElementById("formData");
let formData = [];
let editIndex = null;
const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=genre:science+fiction+history+fantasy+biography+mystery`;



// IIFE function to call the api for fetchinng book details...
(async () => {
  fetch(apiUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network Error");
      }
    })
    .then(data => {
      // console.log("Data", data.items);
      const apiData = data.items;
      
      const transformData = apiData
      //handle api data using filter so undefined data cannot be save.
      .filter(data => (data.volumeInfo.title && data.volumeInfo.authors && data.volumeInfo.categories && data.volumeInfo.industryIdentifiers && data.volumeInfo.publishedDate))
      .map((data)=>({
          title: data.volumeInfo.title,
          author: data.volumeInfo.authors,
          genre: data.volumeInfo.categories?.[0].toLowerCase(),
          isbn: data.volumeInfo.industryIdentifiers?.[0].identifier,
          publicationDate: data.volumeInfo.publishedDate
      }))
      formData = transformData      
      updateTableData(formData);
    })
    .catch(error => {
      console.log("Error:", error);
    });
})();



// validation of data from form...
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

  const bookAge = calculateBookAge(publicationDate); // calling book age calculation function

  if (editIndex !== null) {
    formData[editIndex] = { title, author, isbn, publicationDate, genre, bookAge };
    editIndex = null;
  } else {
    formData.push({ title, author, isbn, publicationDate, genre, bookAge });
    alert("Book Updating Successfully")

  }
  console.log("formdata after add", formData);
  
  updateTableData(formData); //passing data from form to updateTableData function for display
  form.reset();
});



// Function to calculate the age of book...

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
};



// Function to display and update the table...

const updateTableData = (books) => {
  const tableBody = document.querySelector("#tableData tbody");
  tableBody.innerHTML = '';
  
  books.forEach((data, index) => {
      const row = document.createElement('tr');
      const author = document.createElement('td');
      author.textContent = data.author;
      row.appendChild(author);

      const title = document.createElement('td');
      title.textContent = data.title;
      row.appendChild(title);

      const isbn = document.createElement('td');
      isbn.textContent = data.isbn[0].identifier || data.isbn;
      row.appendChild(isbn);

      const pDate = document.createElement('td');
      const fetchPublishDate = data.publicationDate;
      pDate.textContent = fetchPublishDate;
      const calculateFetchBookAge = calculateBookAge(fetchPublishDate);
      row.appendChild(pDate);

      const genre = document.createElement('td');
      genre.textContent = data.genre;
      row.appendChild(genre);

      const bookAge = document.createElement('td');
      bookAge.textContent = calculateFetchBookAge; // Use calculated age here
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
};


// Function to delete listed data...

const deleteBook = (index) => {
  formData.splice(index, 1);
  updateTableData(formData);
  alert("Book Delete Successfully")
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
  const filteredFormData = selectedGenre ? formData.filter(book =>
    book.genre.toLowerCase()   === selectedGenre.toLowerCase()
  ) : formData;
  updateTableData(filteredFormData);
}
