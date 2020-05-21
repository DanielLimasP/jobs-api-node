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
                    displayName: concept.displayName,
                    name: concept.profile.name,
                    lastname: concept.profile.lastname,
                    email: concept.profile.email,
                    password: concept.profile.password,
                    phone: concept.profile.phone,
                    birthDate: concept.profile.birthDate,
                    addressStreet: concept.profile.address.street,
                    addressCity: concept.profile.address.city,
                    addressState: concept.profile.address.state,
                    addressZip: concept.profile.address.zipCode,
                    gender: concept.profile.gender,
                    maritalStatus: concept.profile.maritalStatus,
                    profileImg: concept.profile.profileImg,
                    degree: concept.profile.degree,
                    roles: concept.profile.roles,
                    ine: concept.profile.requiredDocuments.INE,
                    certificate: concept.profile.requiredDocuments.certificate,
                    residenceProof: concept.profile.requiredDocuments.residenceProof
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
        displayName: UserId.displayName,
        name: UserId.profile.name,
        lastname: UserId.profile.lastname,
        email: UserId.profile.email,
        password: UserId.profile.password,
        phone:  UserId.profile.phone,
        birthDate: UserId.profile.birthDate,
        addressStreet: UserId.profile.address.street,
        addressCity: UserId.profile.address.city,
        addressState: UserId.profile.address.state,
        addressZip: UserId.profile.address.zipCode,
        gender: UserId.profile.gender,
        maritalStatus: UserId.profile.maritalStatus,
        profileImg: UserId.profile.profileImg,
        degree: UserId.profile.degree,
        roles: UserId.profile.roles,
        ine: UserId.profile.requiredDocuments.INE,
        certificate: UserId.profile.requiredDocuments.certificate,
        residenceProof: UserId.profile.requiredDocuments.residenceProof
    }
    res.render('usersviews/edituser', {user})
})

router.post('/edit/:id', async (req, res)=>{
    console.log('body', req.body)
    console.log('id', req.body._id)
    const {displayName, name, lastname, email, password, phone, birthdate, street, city, state, zipcode,
        gender, maritalStatus, profileimg, degree, roles, ine, certificate, residenceProof} = req.body
        
        const userObj = {
            "displayName":displayName,
            "profile":{
                "name":name,
                "lastname":lastname,
                "email":email,
                "password":password,
                "phone":phone,
                "birthDate":birthdate,
                "address":{"street":street,"city":city, "state":state, "zipCode":zipcode},
                "gender":gender,
                "maritalStatus":maritalStatus,
                "profileImg":profileimg,
                "degree":degree,
                "roles":roles,
                "requiredDocuments": {"INE": ine, "certificate":certificate, "residenceProof":residenceProof}
            },
            "terms":true
        }

         UserModel.update({_id:req.body._id}, {$set: userObj}, (err, res)=>{
            if(err) return console.log(err)
            req.flash('success_msg', 'User Updated Successfully')
            
         })
        
        res.status(200).redirect('/globalusers')
            
        
})

router.post('/deleteuser', async (req, res)=>{
    UserModel.remove({_id:req.body._id}, (err, concept)=>{
        if(err) return res.status(500).send({message: `Error in the request ${err}`})
        req.flash('success_msg', 'User Removed Successfully')
        res.status(200).redirect('/globalusers')
    })
    
})

router.get('/adduser', async (req, res)=>{
    res.render('usersviews/adduser')
})

router.post('/newuser', async (req, res)=>{
    const {displayName, name, lastname, email, password, phone, birthdate, street, city, state, zipcode,
    gender, maritalStatus, profileimg, degree, roles, ine, certificate, residenceProof} = req.body
    const profile = {
        "name":name,
        "lastname":lastname,
        "email":email,
        "password":password,
        "phone":phone,
        "birthDate":birthdate,
        "address":{"street":street,"city":city, "state":state, "zipCode":zipcode},
        "gender":gender,
        "maritalStatus":maritalStatus,
        "profileImg":profileimg,
        "degree":degree,
        "roles":roles,
        "requiredDocuments":{"INE": ine, "certificate":certificate, "residenceProof":residenceProof}
    }
    const terms = true
    
    const newJob = new UserModel({displayName, profile:profile, terms})
    newJob.save((err, userStored)=>{
        if(err) return res.status.send({message: `Error on model ${err}`})
        req.flash('success_msg', 'User inserted Successfully')
        res.status(200).redirect('/globalusers')
    })
})

module.exports = router