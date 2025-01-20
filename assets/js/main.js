import { Book } from './script.js';
import { Utils } from './utils.js';
import { FormHandler } from './formHandler.js';
import { FetchBook } from './fetchBook.js';
const utils = new Utils();
const formHandler = new FormHandler(utils);
const book = new Book(utils, formHandler);
book.bindEvents();
formHandler.setBookInstance(book);
book.setFormHandlerInstance(formHandler);
const fetchBook = new FetchBook(formHandler, book, utils);
document.getElementById('searchBtn').addEventListener('click', (e) => fetchBook.searchBook(e));
document.getElementById('clearSearchBtn').addEventListener('click', () => fetchBook.clearSearch());
// Pass form events to FormHandler
document.getElementById('form')?.addEventListener('submit', (e) => formHandler.handleFormSubmit(e));
// Example usage of FetchBook
fetchBook.fetchBooks();
