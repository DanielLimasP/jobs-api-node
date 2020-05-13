let router = require('express').Router();

const multipart = require('connect-multiparty')

router.use(multipart({
    uploadDir: 'tmp'
}))

let AuthController = require('../controllers/Auth');

router.post('/uploadphoto', AuthController.uploadProfilePhoto)

router.post('/register', AuthController.signUpUser)
router.get('/signup', (req, res)=>{
    res.render('users/signup')
})

router.post('/login', AuthController.logInUser)
router.get('/signin', (req, res)=>{
    res.render('users/signin')
})

router.post('/logout', AuthController.logOutUser)

router.get('/me', AuthController.getCurrentUser)

module.exports = router;



