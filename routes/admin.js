const express = require('express')
const router = express.Router()
let AdminModel = require('../models/Admin')
const passport = require('passport')
const jwt = require('jsonwebtoken')

router.get('/signup', (req, res)=>{
    res.render('admin/signup')
})

/**
 * 
 router.post('/signup', async (req, res)=>{
     const {name, email, password, confirm_password} = req.body
     console.log("Properties", req.body)
 
     const errors = []
     if(name.length <= 0){
         errors.push({text: 'Please insert your name'})
     }
     if(password !== confirm_password){
         errors.push({text: 'Password do not match'})
     }
     if(password.length < 4){
         errors.push({text: 'Password must be at least 4 characters'})
     }
     if(errors.length > 0){
         res.render('admin/signup', {errors, name, email, password, confirm_password})
     }else{
         const emailUser = await AdminModel.findOne({email: email})
         if(emailUser){
             req.flash('error_msg', 'The email is already in use')
             res.redirect('/admin/signup')
         }else{
             const newUser = new AdminModel({name, email, password})
             newUser.password = await newUser.encryptPassword(password)
             await newUser.save()
             req.flash('success_msg', 'Its done you are on the dark side')
             res.redirect('/admin/signin')
         }
     }
 })
 * 
 */

router.get('/signin', (req, res)=>{
    res.render('admin/signin')
})

router.get('/adminview', (req, res)=>{
    res.render('admin/adminview')
})

router.post('/signup', async (req, res)=>{
    console.info("Body from request", req.body)
    const {name, email, password, confirm_password} = req.body

    const errors = []
     if(name.length <= 0){
         errors.push({text: 'Please insert your name'})
     }
     if(password !== confirm_password){
         errors.push({text: 'Password do not match'})
     }
     if(password.length < 4){
         errors.push({text: 'Password must be at least 4 characters'})
     }
     if(errors.length > 0){
         res.render('admin/signup', {errors, name, email, password, confirm_password})
     }else{
         const emailUser = await AdminModel.findOne({email: email})
         if(emailUser){
             req.flash('error_msg', 'The email is already in use')
             res.redirect('/admin/signup')
         }else{
             const newUser = new AdminModel({name, email, password})
             newUser.password = await newUser.encryptPassword(password)
             newUser.save((err)=>{
                let token = jwt.sign({id: AdminModel._id}, process.env.JWT_SECRET, {
                    expiresIn: 864000 // expires in 24 hours
                });
                //if (err) return res.status(500).send({ message: `Error creating admin: ${err}` })
                //return res.status(201).send({ token: token, message:'Admin created' })
            })
             req.flash('success_msg', 'Its done you are on the dark side')
             res.redirect('/admin/signin')
         }
     }
})

router.post('/signin', (req, res)=>{
    console.info("body from request", req.body)
    const email = req.body.email
    const pass = req.body.password
    let passwordIsValid  = false
    AdminModel.findOne({'email': email}).then((admin)=>{
        console.log(admin)
        if(!admin) return res.status(404).send('No user found')
        let passwordIsValid = admin.matchPassword(pass)
        if(passwordIsValid){
            let token = jwt.sign({email: admin.email}, process.env.JWT_SECRET, { expiresIn: 864000 })
            console.log({auth: true, token: token, name: admin.name, email: admin.email});
            req.flash('success_msg', 'User signed in')
            res.redirect('/admin/adminview')
        }else{
            console.log({auth: false, message: 'Password is not valid'})
            req.flash('error_msg', 'Password is not valid')
            res.redirect('/admin/signin')
        }
    })
})



/**
 * 
 router.post('/signin', passport.authenticate('local', {
     successRedirect: '/adminview',
     failureFlash: '/signin',
     failureFlash: true
 }))
 * 
 */

router.get('/logout', (req, res)=>{
    console.log({auth: false, token: null});
    req.flash('success_msg', 'User logged out')
    res.redirect('/admin/signin')
})

module.exports = router