const router = require('express').Router();
 
//auth
router.use('/login', require('./login')); 
router.use('/register', require('./register')); 
router.use('/token', require('./token')); 


router.use('/aquariums', require('./aquariums')); 
router.use('/datatypes', require('./datatypes')); 
router.use('/users', require('./users')); 
router.use('/texts', require('./texts')); 

module.exports = router;  