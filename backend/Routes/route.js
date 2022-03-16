const express = require('express')
const router = express.Router()
const {userData, login} = require('../Controller/controller')

router.post('/signup', userData)
router.post('/login', login)

module.exports = router