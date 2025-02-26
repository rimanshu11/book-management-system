import { Utils } from "./utils.js";
export class BookManagerHelper {
    bookStore;
    showTable;
    sortBy;
    sortBtn;
    constructor(bookStore, showTable) {
        this.bookStore = bookStore;
        this.showTable = showTable;
        this.sortBy = document.getElementById('sortBy');
        this.sortBtn = document.getElementById('sortBtn');
    }
    toggleSortBtn() {
        if (this.bookStore.bookList.length <= 1) {
            this.sortBy.disabled = true;
            this.sortBtn.disabled = true;
        }
        else {
            this.sortBy.disabled = false;
            this.sortBtn.disabled = true;
            this.sortBy?.addEventListener('change', () => {
                if (this.sortBy.value !== '') {
                    this.sortBtn.disabled = false;
                    this.sortBtn.value = ''; // Set sortBtn value to empty string
                }
            });
            this.sortBtn?.addEventListener('change', this.sortBook.bind(this));
        }
    }
    //method to get the value of the selected option and call sortBooks method
    sortBook() {
        const sortBy = this.sortBy.value;
        const sortBtn = this.sortBtn.value;
        const sortedBooks = this.sortBooks(sortBy, sortBtn);
        this.showTable.updateTableData(sortedBooks);
    }
    //method to sort the books
    sortBooks(sortBy, sortBtn) {
        const sortedBooks = [...this.bookStore.bookList];
        const direction = sortBtn === 'dsc' ? -1 : 1;
        if (sortBy === 'author') {
            sortedBooks.sort((a, b) => {
                const authorA = a.author ? String(a.author) : '';
                const authorB = b.author ? String(b.author) : '';
                return direction * authorA.localeCompare(authorB);
            });
        }
        else if (sortBy === 'title') {
            sortedBooks.sort((a, b) => {
                const titleA = a.title ? String(a.title) : '';
                const titleB = b.title ? String(b.title) : '';
                return direction * titleA.localeCompare(titleB);
            });
        }
        return sortedBooks;
    }
    // method to calculate number of books in table
    totalBookCount() {
        const displayTotalBook = document.getElementById('total-iteam');
        displayTotalBook.innerHTML = `Total Books: ${this.bookStore.bookList.length}`;
        this.toggleSortBtn();
    }
    // Method to calculate the age of the book
    calculateBookAge(publicationDate) {
        const currentDate = new Date();
        const pubDate = new Date(publicationDate);
        const ageInYears = currentDate.getFullYear() - pubDate.getFullYear();
        const ageInMonths = currentDate.getMonth() - pubDate.getMonth();
        const ageInDays = currentDate.getDate() - pubDate.getDate();
        if (currentDate < pubDate) {
            Utils.toggleError('publicationDate-error', 'Future dates are not permissible. Please choose a valid date');
            return '';
        }
        let ageText = ageInYears > 0
            ? `${ageInYears} year(s)`
            : ageInMonths > 0
                ? `${ageInMonths} month(s)`
                : ageInDays > 0
                    ? `${ageInDays} day(s)`
                    : `Less than a day old`;
        return ageText;
    }
    // Method to calculate discount price
    discountCalculation(price, discountedPrice) {
        if (price === undefined && discountedPrice === undefined) {
            price = 0;
            discountedPrice = 0;
            if (price === discountedPrice) {
                return `<span class="text-green-500 font-bold">${price.toFixed()} /-</span>`;
            }
            else {
                const percentage = (discountedPrice / price) * 100;
                const discountPercentage = (100 - percentage).toFixed();
                return `
          <span class="line-through text-red-500 font-semibold">${price.toFixed()} rs/-</span>
          <span class="text-green-600 font-bold">(${discountPercentage}% Off)</span><br>
          <span class=" text-blue-600  font-semibold">${discountedPrice.toFixed()} rs/-</span>
        `;
            }
        }
        else {
            if (price === discountedPrice || discountedPrice === 0) {
                return `<span class="text-green-500 font-bold">${price.toFixed()} rs/-</span>`;
            }
            else {
                const percentage = (discountedPrice / price) * 100;
                const discountPercentage = (100 - percentage).toFixed();
                return `
          <span class="line-through text-red-500 font-semibold">${price.toFixed()} rs/-</span>
          <span class="text-green-600 font-bold">(${discountPercentage}% Off)</span><br>
          <span class=" text-blue-600  font-semibold">${discountedPrice.toFixed()} rs/-</span>
        `;
            }
        }
    }
}
