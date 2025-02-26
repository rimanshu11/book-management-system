export class BookStore {
    bookList;
    showTable;
    constructor(showTable) {
        this.bookList = [];
        this.showTable = showTable;
    }
    addBook(book) {
        this.bookList.push(book);
        this.displayBooksData();
    }
    totalBookCount() {
        const displayTotalBook = document.getElementById('total-iteam');
        displayTotalBook.innerHTML = `Total Books: ${this.bookList.length}`;
    }
    displayBooksData() {
        this.showTable.updateTableData(this.bookList);
    }
}
