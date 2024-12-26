const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=`;

// IIFE function to call the api for fetchinng book details...
(async () => {
  fetch(`${apiUrl}genre:science+fiction+history+fantasy+biography+mystery`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network Error');
      }
    })
    .then((data) => {
      const apiData = data.items;
      console.log(apiData);
      
      const transformedData = transformData(apiData);
      if(transformedData){
        console.log(transformedData);
        formData = transformedData;
        updateTableData(formData);
      }
    })
    .catch((error) => {
      console.log('Error:', error);
    });
})();

// Function to search book based on title...
const searchBook = async (e) => {
  e.preventDefault();
  const searchValue = document.getElementById('search').value.trim().toLowerCase();
  if (searchValue === '') {
    updateTableData(formData); // Show all books from formData
  } else {
    try {
      // Fetch books based on the title search
      const response = await fetch(`${apiUrl}title:${searchValue}`);
      const data = await response.json();

      if (response.ok && data.items) {
        const filteredBooks = data.items
          .filter((data) => {
            const title = data.volumeInfo.title.toLowerCase();
            return title.includes(searchValue);
          })
        const transformedData = transformData(filteredBooks);
        if (transformedData.length < 1) {
          alert('No book found');
          updateTableData(formData);
        } else {
          updateTableData(transformedData);
        }
      } else {
        alert('No books found for the search term');
        updateTableData(formData);
      }
    } catch (error) {
      console.log('Error fetching books:', error);
    }
  }
};


const transformData = (apiData) => {
  return apiData
    .filter((data) => {
      const industryIdentifier = data.volumeInfo.industryIdentifiers?.[0]?.identifier;
      return (
        data.volumeInfo.title &&
        data.volumeInfo.authors &&
        data.volumeInfo.categories &&
        industryIdentifier &&
        data.volumeInfo.publishedDate &&
        !isNaN(industryIdentifier)
      );
    })
    .map((data) => ({
      title: data.volumeInfo.title,
      author: data.volumeInfo.authors,
      genre: data.volumeInfo.categories?.[0].toLowerCase(),
      isbn: data.volumeInfo.industryIdentifiers?.[0].identifier,
      publicationDate: data.volumeInfo.publishedDate,
    }));
}

