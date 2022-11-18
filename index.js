const Route = require('express').Router()
const bcrypt = require('bcrypt')
const {Router} = require('express')
const JWT = require("jsonwebtoken")

const {check, validationResult} = require('express-validator')

const {users} = require("./Db.js")

Route.get('/', (req,res)=>{
    res.send("checking page is working")
})

Route.post("/signup", [
    check("email", "please provide a valid email").isEmail(),
    check("password", "please provide password greater thatn 6 characters").isLength({
        min:6
    }),
])

async(res,res)=>{
    const {email,password} = req.body
    console.log(email,password);

    const err = validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).json({
            err:err.array()
        })
    }
    let user = users.find((user)=>{
        return user.email === email
    })
    if(user){
        return res.status(400).json({
            err:[{
                "msg":"This user already exists"
            }]
        })
    }

    let hashpassword = await bcrypt.hash(password, 10)
    users.push({email, password:hashpassword})
    const token = await JWT.sign({
        email
    }, "asdsadsadadasd",{
        expiresIn:36000
    })
    res.json({token})
    console.log(hashpassword)
    res.send("checking page is working")
}

Route.get("/all", (req,res)=>{
    res.json(users)
})

module.exports = Route