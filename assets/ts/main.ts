import { Book } from './script';
import { Utils } from './utils';
import { FormHandler } from './formHandler';
import { FetchBook } from './fetchBook';

const utils = new Utils();

const formHandler = new FormHandler(utils);

const book = new Book(utils, formHandler);
book.bindEvents();
formHandler.setBookInstance(book);
book.setFormHandlerInstance(formHandler);

const fetchBook = new FetchBook(formHandler, book, utils);


(document.getElementById('searchBtn') as HTMLButtonElement).addEventListener(
  'click',
  (e) => fetchBook.searchBook(e),
);
(document.getElementById('clearSearchBtn') as HTMLButtonElement).addEventListener(
  'click',
  () => fetchBook.clearSearch(),
);

// Pass form events to FormHandler
(document.getElementById('form') as HTMLFormElement)?.addEventListener(
  'submit',
  (e) => formHandler.handleFormSubmit(e),
);

// Example usage of FetchBook
fetchBook.fetchBooks();
