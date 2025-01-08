interface SaleInfo {
    listPrice: { amount: number };
    retailPrice: { amount: number };
  }
  
  interface VolumeInfo {
    title: string;
    authors: string;
    categories?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
    publishedDate: string;
  }
  
  interface ApiBookData {
    saleInfo: SaleInfo;
    volumeInfo: VolumeInfo;
  }
  
  interface TransformedBookData {
    discountPrice: number;
    price: number;
    title: string;
    author: string;
    genre: string;
    isbn: string;
    publicationDate: string;
    bookAge: string;
  }
  
  class FetchBook extends Book {
    public apiUrl: string;
    public transformedData: [] = [];
    constructor() {
      super();
      this.apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
      this.bookList = [];
      this.fetchBooks();
    }
  
    // Method to show and hide the loader
    toggleLoader(isLoading: boolean) {
      const loaderElement = document.getElementById('loader');
      loaderElement?.classList.toggle('hidden', !isLoading);
    }
  
    // Method to fetch data from API
    async fetchData(query: string, max = 10): Promise<ApiBookData[]> {
      this.toggleLoader(true);
      try {
        const response = await fetch(`${this.apiUrl}${query}&startIndex=0&maxResults=${max}`);
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
  
    // Method to fetch books
    async fetchBooks(query = 'genre:science+fiction+history+fantasy+biography+mystery') {
      const booksData = await this.fetchData(query,40);      
      this.handleFetchedData(booksData);
    }
  
    // Method to handle the fetched data
    handleFetchedData(apiData: ApiBookData[]) {
      if (apiData.length) {
        const transformedData = this.transformData(apiData);
        this.bookList = transformedData;
        this.updateTableData(this.bookList);

      } else {
        this.updateTableData(this.bookList);
      }
    }
  
    // Method to search books based on the search value
    async searchBook(e: Event) {
      e.preventDefault();
      const searchValue = (document.getElementById('search') as HTMLInputElement).value.trim().toLowerCase();
  
      if (searchValue === '') {
        this.updateTableData(this.bookList);
      } else {
        const booksData = await this.fetchData(searchValue);
        this.handleFetchedData(booksData);
      }
    }
  
    // Method to clear the search result
    clearSearch() {
      const searchField = (document.getElementById('search') as HTMLInputElement).value.trim();
      if (searchField) {
        (document.getElementById('search') as HTMLInputElement).value = '';
        this.fetchBooks();
      }
    }
  
    // Method to transform API data into a custom structure
    transformData(apiData: ApiBookData[]): TransformedBookData[] {        
      return apiData
        .filter((data) => this.isValidBookData(data))
        .map((data) => ({
          discountPrice: data.saleInfo.retailPrice.amount,
          price: data.saleInfo?.listPrice?.amount,
          title: data.volumeInfo?.title,
          author: data.volumeInfo?.authors,
          genre: data.volumeInfo?.categories?.[0]?.toLowerCase()?? '',
          isbn: data.volumeInfo?.industryIdentifiers?.[0]?.identifier?? '',
          publicationDate: data.volumeInfo?.publishedDate,
          bookAge: this.calculateBookAge(data.volumeInfo?.publishedDate),
        }));
    }
  
    // Method to validate book data
    isValidBookData(data: ApiBookData): boolean {
      const industryIdentifier = data.volumeInfo?.industryIdentifiers?.[0]?.identifier;
        return (!!data.saleInfo?.listPrice?.amount &&
        !!data.saleInfo?.retailPrice?.amount &&
        !!data.volumeInfo?.title &&
        !!data.volumeInfo?.authors &&
        !!data.volumeInfo?.categories?.[0] &&
        !!industryIdentifier &&
        !!data.volumeInfo.publishedDate &&
        !isNaN(Number(industryIdentifier)))
    }
  }
  
  const fetchBook = new FetchBook();
  (document.getElementById('searchBtn') as HTMLInputElement).addEventListener('click', (e) => fetchBook.searchBook(e));
  