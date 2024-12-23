# book-management-system
Book Management System is an easy-to-use tool built to help you organize and manage books in libraries, bookstores, or personal collections. It makes it simple to add new books, update existing ones, delete books you no longer need, and search for specific titles. You can also manage important book details like the title, author, genre, ISBN. 

# Phases for Book Management System (BMS):

1. Requirements Phase:
This phase involves gathering and documenting all the necessary requirements from the stakeholders (such as users, business managers, and technical teams). The key deliverables are:

a) Functional Requirements:
	User login and authentication.
	Add, edit, delete, and search for books.
	Track book availability (borrowed/available).
	User profiles (admin and regular users).
	Book categories (fiction, non-fiction, etc.).
	Book transactions (borrow, return, reserve).
b) Non-Functional Requirements:
	Scalability and performance.
	Data security and privacy.
	User-friendly interface.
	Technical Requirements:

Web-based system using HTML, CSS, JavaScript for frontend.
Server-side with Node.js (Express).
Database: MySQL or MongoDB for storing book data.

2. Design Phase:
a) Database Design:
	Create ERD (Entity Relationship Diagram) for tables like Books, Users, Transactions.
b) UI/UX Design:
	Design wireframes for key pages (e.g., login, book list, book details, user profile).
c) Architecture Design:
        Design the system architecture (client-server and 3-tier model).

3. Implementation Phase:
a) Frontend Development:
	Develop static pages using HTML and CSS.
	Add interactivity using JavaScript (e.g., book search, form validation).
b) Backend Development:
	Set up a backend server using a suitable framework (e.g., Node.js with Express or Spring Boot).
	Set up the database and integrate with backend.
c) API Development:
	Develop RESTful APIs for book management (CRUD operations).

4. Testing Phase:
a) Unit Testing:
	Test individual components of the backend (API testing) and frontend (UI testing).
b) Integration Testing:
	Test the integration between the frontend, backend, and database.
c) User Acceptance Testing (UAT):
	Verify that the system meets the business requirements.

5. Deployment Phase:
	Deploy the application to a cloud server or web hosting service (e.g., AWS, Digital Ocean ,Heroku).
	Configure the database server and ensure all environment variables are set up correctly.
6. Maintenance Phase:
	Regular updates for bug fixes, security patches, and feature enhancements.
	Performance monitoring and scaling based on user growth.


# Features

1. **Add Book**  
   - Users can add a new book to their collection using a simple form.  
   - The form includes fields such as book title, author, genre, publication year, and more.

2. **Delete Book**  
   - Users can delete any book they have added to the system.  
   - This helps keep the collection organized and up to date.

3. **Edit Book**  
   - Users can update the details of any listed book.  
   - They can correct typos, change the author, or modify any other information.

4. **Display Books**  
   - All books added by the user are displayed in a tabular format.  
   - This table allows for easy viewing and management of the book collection.

5. **Fetch Books**  
   - The system integrates with the Google Books API to fetch book details.  
   - Users can search for books using this API and display them in the table.

6. **Asynchronous Search**  
   - Users can search for their favorite books by typing the title in a search bar.  
   - The search is performed asynchronously, providing instant results.


# Setup Instruction

1) clone the github repository

```bash
git clone 'https://github.com/rimanshu11/book-management-system.git'
```
2) Keep the folder structure as this.
book-management-system/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
├── diagram/
│   ├── 3-tier-architecture.png
│   ├── client-server-architecture.jpeg
│   └── er-diagram.png
└── readme.md


3) Start the Live server

# Technology used

Frontend- HTML, CSS, Javascript