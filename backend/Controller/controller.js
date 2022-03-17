const model = require('../Model/model')
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userData = async  (req, res) => {
    const saltPassword = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(req.body.password, saltPassword);
    const bcryptConfirmPassword = await bcrypt.hash(req.body.confirmPassword, saltPassword);

    const register = new model({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        age: req.body.age,
        country: req.body.country,
        password: bcryptPassword,
        confirmPassword: bcryptConfirmPassword,
        zip: req.body.zip
    })
    register
    .save()
    .then(response => console.log(response))
    .catch(err => console.log(err))
}

if (user.status != "Active") {
      res.status(401).send({
      message: "Pending Account. Please Verify Your Email!",
    });
  }
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({error: "Please fill in the field"})
        }
        const userlogin = await model.findOne({ email: email })

        if (userlogin) {
            const token = jwt.sign(
                {
                    password: req.body.password,
                    email: req.body.email,

                 },   
             "secret294")
            const isMatch = await bcrypt.compare(password, userlogin.password)
            if(!isMatch) {
                res.status(400).json({ error: "Invalid email and password"})
            } else {
                res.json({ user: token, message: "User successfully logged In"}, )
                console.log("Logged In");
            }
        }
         else {
            res.status(400).json({error: "invalid email and password"})
        }
    } catch (error) {
        console.log("error");
    }
}

module.exports = {
    userData, login
}