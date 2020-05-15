const express = require('express')
const router = express.Router()

router.get('/', (req, res)=>{
    res.render('index')
})

router.get('/about', (req, res)=>{
    res.render('about')
})

router.get('/aboutlogged', (req, res)=>{
    res.render('aboutlogged')
})

module.exports = router