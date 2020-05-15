const express = require('express')
let router = express.Router()
const UserModel = require('../models/User')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const multipart = require('connect-multiparty')

router.use(multipart({
    uploadDir: 'tmp'
}))

router.get('/users/userlist', async (req, res)=>{
    await UserModel.find({name: 'Juan'}).sort({name: 'desc'}).then(concepts=>{
        const ctx = {
            users: concepts.map(concept =>{
                return {
                    _id: concept_id,
                    name: concept.name,
                    lastname: concept.lastname,
                    email: concept.email
                    
                }
            })
        }
        res.render('users/globalusers', {users: ctx.users})
    })
    

})

router.get('/globalusers',  (req,res)=>{
    res.render('usersviews/globalusers')
})

module.exports = router