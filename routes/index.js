const express = require('express')
const router = express.Router()
const UserModel = require('../models/User')

router.get('/', (req, res)=>{
    res.render('index')
})

router.get('/about', (req, res)=>{
    res.render('about')
})

router.get('/aboutlogged', (req, res)=>{
    res.render('aboutlogged')
})

router.get('/globalusers', async (req, res)=>{
    await UserModel.find({}).sort({name: 'desc'}).then(concepts=>{
        const ctx = {
            users: concepts.map(concept =>{
                return {
                    _id: concept._id,
                    name: concept.profile.name,
                    lastname: concept.profile.lastname,
                    email: concept.profile.email
                    
                }
            })
        }
        console.log("Body", ctx.users)
        res.render('usersviews/globalusers', {users: ctx.users})
    })
    
})

module.exports = router