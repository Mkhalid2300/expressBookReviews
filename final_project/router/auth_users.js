const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const userExists = users.some(u => u.username === username);
  return userExists;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const validUser = users.some(u => u.username === username && u.password === password);
  return validUser;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required"});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

  let accessToken = jwt.sign({
    data: username
  }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken, username
  }
  return res.status(200).json({message: "User successfully logged in", token: accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!review) {
    return res.status(404).json({message: "Review text is required as a query parameter"});
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review successfully added/updated", reviews: books[isbn].reviews});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (books[isbn].reviews[username] === undefined) {
    return res.status(404).json({message: "No review by this user found for this book"});
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({message: "Review successfully deleted", reviews: books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;