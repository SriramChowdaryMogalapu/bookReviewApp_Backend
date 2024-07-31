const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.status(403).json({ message: "Kindly enter all the details!!" });
    }
    if (username && password) {
        let m = users.filter((user) => {
            return user.username === username && user.password === password
        })
        if (m.length > 0) {
            return res.status(403).json({ message: "User Already Exists!!" });
        }
        else {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully Registered!! Now you can Login..." });
        }
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.body.isbn;
    res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;

    const bookKeys = Object.keys(books);

    const result = bookKeys
        .map(key => books[key])
        .filter(book => book.author.toLowerCase() === author.toLowerCase());

    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).send('Author not found');
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;

    const bookKeys = Object.keys(books);

    const result = bookKeys
        .map(key => books[key])
        .filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).send('Author not found');
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.body.isbn;
    res.send(books[isbn]["reviews"]);
});

const getBooksAsync = async () => {
    try {
        // Simulating async behavior
        return new Promise((resolve) => {
            setTimeout(() => resolve(books), 100);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

public_users.get('/books-async', async (req, res) => {
    try {
        const books = await getBooksAsync();
        res.json(books);
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

public_users.get('/books-async/isbn/:isbn', async (req, res) => {
    try {
        let isbn = req.params.isbn;
        const books = await getBooksAsync();
        res.json(books[isbn]);
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

public_users.get('/books-async/author', async (req, res) => {
    try {
        let author = req.params.author;
        const books = await getBooksAsync();
        const bookKeys = Object.keys(books);

        const result = bookKeys
            .map(key => books[key])
            .filter(book => book.author.toLowerCase() === author.toLowerCase());

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('Author not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

public_users.get('/books-async/title', async (req, res) => {
    try {
        let title = req.params.title;
        const books = await getBooksAsync();
        const bookKeys = Object.keys(books);

        const result = bookKeys
            .map(key => books[key])
            .filter(book => book.title.toLowerCase() === title.toLowerCase());

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('Author not found');
        }
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

module.exports.general = public_users;
