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
                    email: concept.profile.email,
                    password: concept.profile.password,
                    phone: concept.profile.phone
                }
            })
        }
        
        res.render('usersviews/globalusers', {users: ctx.users})
    })
    
})

router.get('/edituser/:id', async (req, res)=>{
    const UserId = await UserModel.findById(req.params.id)
    const user = {
        _id: UserId._id,
        name: UserId.profile.name,
        lastname: UserId.profile.lastname,
        email: UserId.profile.email,
        password: UserId.profile.password,
        phone:  UserId.profile.phone
    }
    res.render('usersviews/edituser', {user})
})

router.put('/edit/:id', async (req, res)=>{
    const { name, lastname, email, password, phone } = req.body
    console.log('id', req.params.id)
    console.log('body', req.body)
    console.log('variables', {name, lastname, email, password, phone})
    await UserModel.findByIdAndUpdate(req.params.id, {name, lastname, email, password, phone})

    req.flash('success_msg', 'User uptdated Successfully')
    res.status(200).redirect('/globalusers')
})

router.delete('/deleteuser/:id', async (req, res)=>{
    await UserModel.findByIdAndDelete(req.params._id)
    req.flash('success_msg', 'User Removed Successfully')
    res.redirect('/usersviews/globalusers')
})

module.exports = router