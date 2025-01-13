
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
  public currentPage: number = 1;
  public totalPages: number = 1; 
  public booksPerPage: number = 20;
  public totalBooks: number = 0;   
  constructor() {
    super();
    this.apiUrl = config.apiUrl;
    this.bookList = [];
    this.fetchBooks();
  }

  // Method to show and hide the loader
  toggleLoader(isLoading: boolean) {
    const loaderElement = document.getElementById('loader');
    loaderElement?.classList.toggle('hidden', !isLoading);
  }

  // Method to fetch data from API
  async fetchData(query: string, max = 10, startIndex = 0): Promise<ApiBookData[]> {
    this.toggleLoader(true);
    try {
      const response = await fetch(`${this.apiUrl}${query}&startIndex=${startIndex}&maxResults=${max}`);
      if (!response.ok) {
        throw new Error('Network Error');
      }
      const data = await response.json();
      if (this.totalBooks === 0) {
        this.totalBooks = data.totalItems || 100;
      }        
      return data.items || [];
    } catch (error) {
      console.error('Error:', error);
      this.showModal("Something went wrong, Try Again!");
      return [];
    } finally {
      this.toggleLoader(false);
    }
  }

  // Method to fetch books
  async fetchBooks(query = 'genre:science+fiction+history+fantasy+biography+mystery') {
    const booksData = await this.fetchData(query, this.booksPerPage, (this.currentPage - 1) * this.booksPerPage);
    this.handleFetchedData(booksData);
    this.updatePagination();      
  }

  // Method to handle the fetched data
  handleFetchedData(apiData: ApiBookData[]) {
    if (apiData.length) {
      const transformedData = this.transformData(apiData);
      this.bookList = transformedData;
      this.toggleSortBtn();
      this.updateTableData(this.bookList);
    } else {
      this.updateTableData(this.bookList);
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
        genre: data.volumeInfo?.categories?.[0]?.toLowerCase() ?? '',
        isbn: data.volumeInfo?.industryIdentifiers?.[0]?.identifier ?? '',
        publicationDate: data.volumeInfo?.publishedDate,
        bookAge: this.calculateBookAge(data.volumeInfo?.publishedDate),
      }));
  }

  // Method to search books based on the search value
  async searchBook(e: Event) {
    e.preventDefault();
    const searchValue = (document.getElementById('search') as HTMLInputElement).value.trim().toLowerCase();
    this.currentPage = 1;
    if (searchValue === '') {
      this.fetchBooks();
    } else {
      const booksData = await this.fetchData(searchValue, this.booksPerPage, 0);        
      this.handleFetchedData(booksData);
      this.totalBooks = 0;
      this.updatePagination()
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

  // Method to update pagination buttons
  updatePagination() {    
    this.totalPages = Math.ceil(this.totalBooks / this.booksPerPage);
    if(this.totalPages === 0){
      this.totalPages = 1;
    }      
    const paginationContainer = document.getElementById('pagination')!;
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.setAttribute("class", "bg-indigo-700 text-white py-2 px-4 hover:bg-indigo-700 rounded-xl")
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener('click', () => this.changePage(this.currentPage - 1));

    const pageNumbers = document.createElement('span');
    pageNumbers.innerText = `Page ${this.currentPage} of ${this.totalPages}`;

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.setAttribute("class", "bg-indigo-700 text-white py-2 px-4 hover:bg-indigo-700 rounded-xl")
    nextButton.disabled = this.currentPage === this.totalPages;
    nextButton.addEventListener('click', () => this.changePage(this.currentPage + 1));

    const displayTotalBook = document.getElementById('total-iteam') as HTMLElement;
    displayTotalBook.innerHTML = `Total Books: ${this.bookList.length}`
    paginationContainer.append(prevButton, pageNumbers, nextButton);
  }

  // Method to change page and fetch books
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchBooks();
    }
  }

  // Method to validate book data
  isValidBookData(data: ApiBookData): boolean {
    const industryIdentifier = data.volumeInfo?.industryIdentifiers?.[0]?.identifier;
    return !!(
      data.saleInfo?.listPrice?.amount &&
      data.saleInfo?.retailPrice?.amount &&
      data.volumeInfo?.title &&
      data.volumeInfo?.authors &&
      data.volumeInfo?.categories?.[0] &&
      industryIdentifier &&
      data.volumeInfo.publishedDate &&
      !isNaN(Number(industryIdentifier))
    );
  }
}

const fetchBook = new FetchBook();
(document.getElementById('searchBtn') as HTMLInputElement).addEventListener('click', (e) => fetchBook.searchBook(e));