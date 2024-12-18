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
  console.log(formData);
  if(formData){
    alert("Form submitted successfully")
  }
  
  form.reset();
});


