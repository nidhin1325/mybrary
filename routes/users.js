const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const User = require('../models/user')
const uploadPath = path.join('public', User.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Users Route
router.get('/', async (req, res) => {
  let query = User.find()
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('title', new RegExp(req.query.name, 'i'))
  }
  
  try {
    const users = await query.exec()
    res.render('users/index', {
      users: users,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New user Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new User())
})

// Create user Route
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const user = new User({
    name: req.body.name,
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newUser = await user.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`users`)
  } catch {
    if (user.coverImageName != null) {
      removeUserCover(user.coverImageName)
    }
    renderNewPage(res, user, true)
  }
})

// Show user Route
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
                           .populate('author')
                           .exec()
    res.render('users/show', { user: user })
  } catch {
    res.redirect('/')
  }
})

function removeUserCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

// Delete Book Page
router.delete('/:id', async (req, res) => {
  let user
  try {
    user = await User.findById(req.params.id)
    await user.remove()
    res.redirect('/users')
  } catch {
    if (user != null) {
      res.render('users/show', {
        user: user,
        errorMessage: 'Could not remove user'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, user, hasError = false) {
  try {
    const users = await User.find({})
    const params = {
     // authors: authors,
      user: user
    }
    if (hasError) params.errorMessage = 'Error Creating user'
    res.render('users/new', params)
  } catch {
    res.redirect('/users')
  }
}

// async function renderNewPage(res, user, hasError = false) {
//   renderFormPage(res, user, 'new', hasError)
// }

// async function renderEditPage(res, user, hasError = false) {
//   renderFormPage(res, user, 'edit', hasError)
// }

// async function renderFormPage(res, user, form, hasError = false) {
//   try {
//     const authors = await Author.find({})
//     const params = {
//       // authors: authors,
//       // book: book
//       user : user
//     }
//     if (hasError) {
//       if (form === 'edit') {
//         params.errorMessage = 'Error Updating user'
//       } else {
//         params.errorMessage = 'Error Creating user'
//       }
//     }
//     res.render(`users/${form}`, params)
//   } catch {
//     res.redirect('/users')
//   }
// }
module.exports = router