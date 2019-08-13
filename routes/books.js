const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/book')
const uploadPath = path.join('public',Book.coverImageBasePath)
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
const Author = require('../models/author')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file , callback) =>{
        callback(null, )
    }
})

// All book Route
router.get('/', async (req, res) => {
    res.send('All books')
  
})

// New book Route
router.get('/new', async (req, res) => {
   try{
     const authors = await Author.find({})  
     const book = new Book()
     res.render('books/new',{
         authors: authors,
         book: book
     })
   }catch{
       res.redirect('/books')

   }

})

// Create Book Route
router.post('/', upload.single('cover'),async (req, res) => {
    const fileName = req.file !=null ? req.file.filename : null
    const book = new book9({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
})

module.exports = router
