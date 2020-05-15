const express = require('express')
const router = express.Router()
const UserModel = require('../models/User')
const passport = require('passport')
const jwt = require('jsonwebtoken')

router.get('/users/globalusers', async (req, res)=>{
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

module.exports = router