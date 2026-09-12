const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required"});
  }

  if (users.some(u => u.username === username)) {
    return res.status(404).json({message: "User already exists"});
  }

  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.keys(books)
    .filter(key => books[key].author === author)
    .map(key => books[key]);
  return res.status(200).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.keys(books)
    .filter(key => books[key].title === title)
    .map(key => books[key]);
  return res.status(200).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get all books using async/await with Axios
async function getAllBooksAxios() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("All books:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching all books:", error.message);
  }
}

// Task 11: Get book details based on ISBN using Promises with Axios
function getBookByISBNAxios(isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      console.log("Book by ISBN:", response.data);
      return response.data;
    })
    .catch(error => {
      console.log("Error fetching book by ISBN:", error.message);
    });
}

// Task 12: Get book details based on Author using async/await with Axios
async function getBooksByAuthorAxios(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    console.log("Books by author:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching books by author:", error.message);
  }
}

// Task 13: Get book details based on Title using async/await with Axios
async function getBooksByTitleAxios(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    console.log("Books by title:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching books by title:", error.message);
  }
}
module.exports.general = public_users;