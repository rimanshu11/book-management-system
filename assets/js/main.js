import { BookStore } from "./bookStore.js";
import { BookManager } from "./bookManager.js";
import { FormHandler } from "./formHandler.js";
import { FetchBook } from "./fetchBook.js";
import { ShowTable } from "./showTable.js";
import { BookManagerHelper } from "./bookManageHelper.js";
document.addEventListener('DOMContentLoaded', () => {
    const showTable = new ShowTable();
    const bookStore = new BookStore(showTable);
    const bookManagerHelper = new BookManagerHelper(bookStore, showTable);
    const formHandler = new FormHandler(bookStore, bookManagerHelper);
    const book = new BookManager(formHandler, bookStore, showTable, bookManagerHelper);
    const fetchBook = new FetchBook(bookStore, bookManagerHelper, book);
    const tableElement = document.getElementById('tableData');
    tableElement.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('button[id^="editBtn-"]')) {
            const index = parseInt(target.id.split('-')[1]);
            book.editBook(index);
        }
        else if (target.matches('button[id^="deleteBtn-"]')) {
            const index = parseInt(target.id.split('-')[1]);
            book.deleteBook(index);
        }
    });
    book.bindEvents();
    document.getElementById('searchBtn').addEventListener('click', (e) => fetchBook.searchBook(e));
    document.getElementById('clearSearchBtn').addEventListener('click', () => fetchBook.clearSearch());
    fetchBook.fetchBooks();
});
