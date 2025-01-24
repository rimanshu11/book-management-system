import { BookStore } from './bookStore.ts';
import { BookManager } from './bookManager.ts';
import { FormHandler } from './formHandler.ts';
import { FetchBook } from './fetchBook.ts';
import { ShowTable } from './showTable.ts';
import { BookManagerHelper } from './bookManageHelper.ts';

document.addEventListener('DOMContentLoaded', () => {
  const showTable = new ShowTable();
  const bookStore = new BookStore(showTable);
  const bookManagerHelper = new BookManagerHelper(bookStore, showTable);
  const formHandler = new FormHandler(bookStore, bookManagerHelper);
  const book = new BookManager(
    formHandler,
    bookStore,
    showTable,
    bookManagerHelper,
  );
  const fetchBook = new FetchBook(bookStore, bookManagerHelper, book);

  const tableElement = document.getElementById('tableData') as HTMLTableElement;
  tableElement.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('button[id^="editBtn-"]')) {
      const index = parseInt(target.id.split('-')[1]);
      book.editBook(index);
    } else if (target.matches('button[id^="deleteBtn-"]')) {
      const index = parseInt(target.id.split('-')[1]);
      book.deleteBook(index);
    }
  });

  book.bindEvents();

  (document.getElementById('searchBtn') as HTMLButtonElement).addEventListener(
    'click',
    (e) => fetchBook.searchBook(e),
  );
  (
    document.getElementById('clearSearchBtn') as HTMLButtonElement
  ).addEventListener('click', () => fetchBook.clearSearch());

  fetchBook.fetchBooks();
});
