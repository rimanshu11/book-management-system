class FetchBook extends Book {
  constructor() {
    super();
    this.apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
    this.bookList = [];
    this.fetchBooks();
  }

  // method to show and hide the loader
  toggleLoader(isLoading) {
    const loaderElement = document.getElementById('loader');
    loaderElement.classList.toggle('hidden', !isLoading);
  }

  // method to API fetch function
  async fetchData(query) {
    this.toggleLoader(true);
    try {
      const response = await fetch(`${this.apiUrl}${query}`);
      if (!response.ok) {
        throw new Error('Network Error');
      }
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error:', error);
      alert("Something went wrong, Try Again!");
      return [];
    } finally {
      this.toggleLoader(false);
    }
  }

  // method to fetch books
  async fetchBooks(query = 'genre:science+fiction+history+fantasy+biography+mystery') {
    const booksData = await this.fetchData(query);
    this.handleFetchedData(booksData);
  }

  // method to handle fetched data
  handleFetchedData(apiData) {
    if (apiData.length) {
      const transformedData = this.transformData(apiData);
      this.bookList = transformedData;
      this.updateTableData(this.bookList);
    } else {
      this.updateTableData(this.bookList);
    }
  }

  // Method to search books based on the search value
  async searchBook(e) {
    e.preventDefault();
    const searchValue = document.getElementById('search').value.trim().toLowerCase();

    if (searchValue === '') {
      this.updateTableData(this.bookList);
    } else {
      // const query = searchValue;
      const booksData = await this.fetchData(searchValue);
      this.handleFetchedData(booksData);
    }
  }
  // method to clear the search result
  clearSearch() {
    const searchField = document.getElementById('search').value.trim();
    if(searchField){
      document.getElementById('search').value = ''
      this.fetchBooks();
    }
  }

  // method to Transform API data into a custom structure
  transformData(apiData) {
    return apiData
      .filter((data) => this.isValidBookData(data))
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

  // method to validate book data
  isValidBookData(data) {
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
  }
}

const fetchBook = new FetchBook();
document.getElementById('searchBtn').addEventListener('click', (e) => fetchBook.searchBook(e));
