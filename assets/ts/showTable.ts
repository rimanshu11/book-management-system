import { formData } from './bookStore';
export class ShowTable {
  constructor() {}
  
  // method to update table data
  public updateTableData(books: formData[]): void {
    const tableBody = document.querySelector('#tableData tbody')!;
    tableBody.innerHTML = '';

    const rows = books.map((book, index) => this.createTableRow(book, index));
    tableBody.insertAdjacentHTML('beforeend', rows.join(''));
  }

  // method to create table row
  public createTableRow(book: formData, index: number): string {    
    return `
      <tr class="border text-center even:bg-gray-200 odd:bg-white">
        <td class="border">${book.author}</td>
        <td class="border">${book.title}</td>
        <td class="border">${book.isbn}</td>
        <td class="border">${book.publicationDate}</td>
        <td class="border">${book.genre}</td>
        <td class="border">${book.discountedPrice}</td>
        <td class="border">${book.bookAge}</td>
        <td class="border">
          <button id="editBtn-${index}" class="border w-full p-1 bg-indigo-500 shadow-lg text-white hover:bg-indigo-700">Edit</button>
          <button id="deleteBtn-${index}" class="border w-full p-1 bg-red-500 shadow-lg text-white hover:bg-red-700">Delete</button>
        </td>
      </tr>
    `;
  }
}
