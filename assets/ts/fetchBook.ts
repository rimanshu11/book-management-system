import { Utils } from './utils.ts';
import { config } from './config.ts';
import { BookStore } from './bookStore.ts';
import { BookManager } from './bookManager.ts';
import { BookManagerHelper } from './bookManageHelper.ts';

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
  discountedPrice: string
  discountPrice: number;
  price: number;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  publicationDate: string;
  bookAge: string;
}

export class FetchBook {
  public apiUrl: string;
  public currentPage: number = 1;
  public totalPages: number = 1;
  public booksPerPage: number = 20;
  public totalBooks: number = 0;

  constructor(
    private bookStore: BookStore,
    private bookManagerHelper: BookManagerHelper,
    private bookManager: BookManager,
  ) {
    this.apiUrl = config.apiUrl;
    this.bookManager = bookManager;
  }

  // Method to fetch data from API
  async fetchData(
    query: string,
    max = 10,
    startIndex = 0,
  ): Promise<ApiBookData[]> {
    Utils.toggleLoader(true);
    try {
      const response = await fetch(
        `${config.apiUrl}${query}&startIndex=${startIndex}&maxResults=${max}`,
      );
      if (!response.ok) {
        throw new Error('Network Error');
      }
      const data = await response.json();
      if (this.totalBooks === 0) {
        this.totalBooks = data.totalItems || 100;
      }
      // this.book.toggleBindEvent(false);
      return data.items || [];
    } catch (error) {
      console.error('Error:', error);
      Utils.showModal('Something went wrong, Try Again!');
      return [];
    } finally {
      Utils.toggleLoader(false);
    }
  }

  // Method to fetch books
  async fetchBooks(
    query = 'genre:science+fiction+history+fantasy+biography+mystery',
  ) {
    const booksData = await this.fetchData(
      query,
      this.booksPerPage,
      (this.currentPage - 1) * this.booksPerPage,
    );
    this.handleFetchedData(booksData);
    this.updatePagination();
  }

  // Method to handle the fetched data
  handleFetchedData(apiData: ApiBookData[]) {
    if (apiData.length) {
      const transformedData = this.transformData(apiData);      
      this.bookStore.bookList = transformedData;
      this.bookStore.displayBooksData();
      this.bookManagerHelper.toggleSortBtn();
    } else {
      this.bookStore.displayBooksData();
      // this.showTable.updateTableData(this.bookStore.bookList);
    }
  }

  // Method to transform API data into a custom structure
  transformData(apiData: ApiBookData[]): TransformedBookData[] {
    return apiData
      .filter((data) => this.isValidBookData(data))
      .map((data) => ({
        discountPrice: data.saleInfo.retailPrice.amount,
        price: data.saleInfo?.listPrice?.amount,
        discountedPrice: this.bookManagerHelper.discountCalculation(data.saleInfo?.listPrice?.amount,data.saleInfo.retailPrice.amount),
        title: data.volumeInfo?.title,
        author: data.volumeInfo?.authors,
        genre: data.volumeInfo?.categories?.[0]?.toLowerCase() ?? '',
        isbn: data.volumeInfo?.industryIdentifiers?.[0]?.identifier ?? '',
        publicationDate: data.volumeInfo?.publishedDate,
        bookAge: this.bookManagerHelper.calculateBookAge(
          data.volumeInfo?.publishedDate,
        ),
      }));
  }

  // Method to search books based on the search value
  async searchBook(e: Event) {
    e.preventDefault();
    const searchValue = (
      document.getElementById('search') as HTMLInputElement
    ).value
      .trim()
      .toLowerCase();
    this.currentPage = 1;
    if (searchValue === '') {
      Utils.toggleError('search-error', 'Enter Author or Title of Book!');
    } else {
      Utils.toggleError('search-error', '');
      const booksData = await this.fetchData(searchValue, this.booksPerPage, 0);
      this.handleFetchedData(booksData);
      this.totalBooks = 0;
      this.updatePagination();
    }
  }

  // Method to clear the search result
  clearSearch() {
    const searchField = (
      document.getElementById('search') as HTMLInputElement
    ).value.trim();
    if (searchField) {
      (document.getElementById('search') as HTMLInputElement).value = '';
      this.fetchBooks();
    }
  }

  // Method to update pagination buttons
  updatePagination() {
    this.totalPages = Math.ceil(this.totalBooks / this.booksPerPage);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
    const paginationContainer = document.getElementById('pagination')!;
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.setAttribute(
      'class',
      'bg-indigo-700 text-white py-2 px-4 hover:bg-indigo-800 rounded-xl',
    );
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener('click', () =>
      this.changePage(this.currentPage - 1),
    );

    const pageNumbers = document.createElement('span');
    pageNumbers.innerText = `Page ${this.currentPage} of ${this.totalPages}`;

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.setAttribute(
      'class',
      'bg-indigo-700 text-white py-2 px-4 hover:bg-indigo-800 rounded-xl',
    );
    nextButton.disabled = this.currentPage === this.totalPages;
    nextButton.addEventListener('click', () =>
      this.changePage(this.currentPage + 1),
    );

    const displayTotalBook = document.getElementById(
      'total-iteam',
    ) as HTMLElement;
    displayTotalBook.innerHTML = `Total Books: ${this.bookStore.bookList.length}`;
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
    const industryIdentifier =
      data.volumeInfo?.industryIdentifiers?.[0]?.identifier;
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
