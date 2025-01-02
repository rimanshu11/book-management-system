class FetchBook extends Book {
  constructor() {
    super(); 
    this.apiUrl = `https://www.googleapis.com/books/v1/volumes?q=`;
    this.fetchBooks();
  }

  // Method to show the loader
  showLoader() {
    document.getElementById('loader').classList.remove('hidden');
  }

  // Method to hide the loader
  hideLoader() {
    document.getElementById('loader').classList.add('hidden');
  }

  // Method to fetch books from the API
  async fetchBooks() {
    this.showLoader();  // Show the loader before starting the fetch process
    try {
      const response = await fetch(`${this.apiUrl}genre:science+fiction+history+fantasy+biography+mystery`);
      if (response.ok) {
        const data = await response.json();        
        const transformedData = this.transformData(data.items);
        this.bookList = transformedData;
        console.log(this.bookList);
        
        this.updateTableData(this.bookList);
      } else {
        alert("Network error");
        throw new Error('Network Error');
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      this.hideLoader(); 
    }
  }

  // Method to search books based on title
  async searchBook(e) {
    e.preventDefault();
    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    if (searchValue === '') {
      this.updateTableData(this.bookList);
    } else {
      this.showLoader();
      try {
        const response = await fetch(`${this.apiUrl}${searchValue}`);
        const data = await response.json();
        if (response.ok && data.items) {
          const filteredBooks = data.items.filter((data) => {
            const title = data.volumeInfo.title.toLowerCase();
            return title.includes(searchValue);
          });
          const transformedData = this.transformData(filteredBooks);
          if (transformedData.length < 1) {
            alert('No book found');
            this.updateTableData(this.bookList);
          } else {
            this.updateTableData(transformedData);
          }
        } else {
          alert('No books found for the search term');
          this.updateTableData(this.bookList);
        }
      } catch (error) {
        console.log('Error fetching books:', error);
      } finally {
        this.hideLoader();
      }
    }
  }

  // Method to transform API data into a custom structure
  transformData(apiData) {
    return apiData
      .filter((data) => {
        const industryIdentifier = data.volumeInfo.industryIdentifiers?.[0]?.identifier;
        return (
          data.saleInfo?.listPrice?.amount &&
          data.saleInfo?.retailPrice?.amount &&
          data.volumeInfo.title &&
          data.volumeInfo.authors &&
          data.volumeInfo.categories &&
          industryIdentifier &&
          data.volumeInfo.publishedDate &&
          !isNaN(industryIdentifier)
        );
      })
      .map((data) => ({
        discountPrice: data.saleInfo.retailPrice.amount,
        price: data.saleInfo.listPrice.amount,
        title: data.volumeInfo.title,
        author: data.volumeInfo.authors,
        genre: data.volumeInfo.categories?.[0].toLowerCase(),
        isbn: data.volumeInfo.industryIdentifiers?.[0].identifier,
        publicationDate: data.volumeInfo.publishedDate,
        bookAge: this.calculateBookAge(data.volumeInfo.publishedDate),
      }));
  }
}

const fetchBook = new FetchBook();
