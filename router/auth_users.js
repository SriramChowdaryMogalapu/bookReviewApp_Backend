const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
   let u=users.filter((user)=>{ return user.username===username});
   if(u.length>0){
    return true;
   }
   else{
    return false;
   }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let u=users.filter((user)=>{return ((user.username===username)&&(user.password===password))});
    if(u.length>0){
        return true;
    }
    else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username=req.body.username;
  let password=req.body.password;
  if(!username || !password){
    return res.status(403).json({message:"Error Occurred!! Please enter the required details.."});
  }
  else{
    if(authenticatedUser(username,password)){
        let accessToken=jwt.sign({data:username},"access",{expiresIn:60*60});
        req.session.authorization={
            accessToken,username
        }
        req.session.username=username;
        return res.status(200).json({message:"User is successfully logged in!!"});
    }
    else{
        return res.status(208).json({message:"Invalid Credentials..."});
    }
  }
});
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn=req.body.isbn;
  let review=req.body.review;
  let username=req.session.username;
  if (!isbn || !review) {
    return res.status(400).send('ISBN and review are required');
  }

  if (!books[isbn]) {
    return res.status(404).send('Book not found');
  }
  books[isbn].reviews[username] = review;

  res.status(200).send('Review added/updated successfully');
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.body.isbn;
    const username = req.session.username;
  
    if (!isbn) {
      return res.status(400).send('ISBN is required');
    }
  
    if (!books[isbn]) {
      return res.status(404).send('Book not found');
    }
  
    // Check if the reviews object exists and if the user has a review
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.status(200).send('Review deleted successfully');
    } else {
      res.status(404).send('Review not found');
    }
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
