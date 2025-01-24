import { ShowTable } from './showTable';

export interface formData {
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  price: number;
  discountPrice: number;
  discountedPrice?: string;
  genre: string;
  bookAge: string;
}

export class BookStore {
  public bookList: formData[];
  private showTable: ShowTable;

  constructor(showTable: ShowTable) {
    this.bookList = [];
    this.showTable = showTable;
  }

  public addBook(book: formData): void {
    this.bookList.push(book);
    this.displayBooksData();
  }
  public totalBookCount(): void {
    const displayTotalBook = document.getElementById(
      'total-iteam',
    ) as HTMLElement;
    displayTotalBook.innerHTML = `Total Books: ${this.bookList.length}`;
  }
  public displayBooksData(): void {
    this.showTable.updateTableData(this.bookList);
  }
}
