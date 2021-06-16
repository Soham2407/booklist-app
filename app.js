// class Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// class for local storage
class Store {
  static getBooksFromStorage() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBookToStorage(book) {
    const books = Store.getBooksFromStorage();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBookFromStorage(isbn) {
    const books = Store.getBooksFromStorage();
    const index = books.findIndex((book) => {
      return book.isbn === isbn;
    });
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static editBookFromStorage(isbnValue) {
    const books = Store.getBooksFromStorage();
    const saveIndexInput = document.getElementById("save-index");
    const title = document.querySelector("#title");
    const author = document.querySelector("#author");
    const isbn = document.querySelector("#isbn");

    let index = books.findIndex((book) => {
      return book.isbn === isbnValue;
    });

    saveIndexInput.value = index;

    title.value = books[index].title;
    author.value = books[index].author;
    isbn.value = books[index].isbn;
  }

  static saveBook() {
    const books = Store.getBooksFromStorage();
    let saveIndex = document.getElementById("save-index").value;

    const title = document.querySelector("#title");
    const author = document.querySelector("#author");
    const isbn = document.querySelector("#isbn");

    books[saveIndex].title = title.value;
    books[saveIndex].author = author.value;
    books[saveIndex].isbn = isbn.value;

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// class for UI
class UI {
  static displayBooks() {
    const books = Store.getBooksFromStorage();

    document.querySelector("#book-list").innerHTML = "";

    books.forEach((book) => {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
      
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button class="btn btn-danger delete">Delete</button></td>
        <td><button class="btn btn-primary edit">Edit</button></td>
      
      `;
    document.querySelector("#book-list").appendChild(row);
  }

  static deleteAndEditBook(el) {
    const isbnValue = el.parentElement.parentElement.children[2].textContent;

    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
      Store.removeBookFromStorage(isbnValue);
      UI.showAlert("Book deleted!!", "success");
    }

    if (el.classList.contains("edit")) {
      Store.editBookFromStorage(isbnValue);
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.classList.add("alert", `alert-${className}`);
    div.textContent = message;
    document.querySelector("h1").insertAdjacentElement("afterend", div);

    // vanish in 2s
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks);

document.querySelector("#submit").addEventListener("click", function (e) {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please enter all the fields", "danger");
  } else {
    // instantiate book class obj
    const book = new Book(title, author, isbn);

    // Add book to list
    UI.addBookToList(book);

    // Add Book to local storage
    Store.addBookToStorage(book);

    UI.showAlert("Book Added!!", "success");

    // clear inputs
    UI.clearFields();
  }
});

document.querySelector("#book-list").addEventListener("click", function (e) {
  UI.deleteAndEditBook(e.target);
});

document.querySelector("#save").addEventListener("click", function (e) {
  e.preventDefault();
  Store.saveBook();

  UI.showAlert("Book Updated!!", "success");

  UI.displayBooks();

  // clear inputs
  UI.clearFields();
});
