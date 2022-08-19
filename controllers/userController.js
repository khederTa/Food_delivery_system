const bcryptjs = require('bcryptjs');
//const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const adminController = require('./adminController');
var varjs = require('../config/varjs')
const Food = require('../models/Food');
const Contact = require('../models/Contact')


const getIndex = (req, res) => {
    Food.find({}, (err, result) => {
        if (err) {
            throw err;
        }
        res.render('index', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result })
    })

}
const getContactPage = (req, res) => {
    res.render('contactus', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin() })
}
const postContact = (req, res) => {
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        title: req.body.title,
        message: req.body.message
    })
    console.log(contact)
    contact.save((err, result)=>{
        if(err) throw err
        res.redirect('/')
    })
}
const getFoods = (req, res) => {
    Food.find({}, (err, result) => {
        if (err) throw err;
        res.render('foods', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result })
    })
}

const getAdminDashboard = (req, res) => {
    if (varjs.getAdmin() == 'yes') {
        Food.find({}, (err, result) => {
            if (err) throw err;
            Contact.find({}, (err, ContactUs)=>{
                res.render('AdminDashboard', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result, ContactUs })

            })
        })
    }

    else {
        Food.find({}, (err, result) => {
            if (err) throw err;
            res.render('index', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result })
        })
    }
}

const getLogin = (req, res) => {
    varjs.setAdminNo();
    varjs.setLoggedinNo()
    res.render('login', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin() })
}

const getRegister = (req, res, next) => {
    varjs.setAdminNo();
    varjs.setLoggedinNo()
    res.render('register', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin() })
}
const postRegister = (req, res, next) => {

    const { first_name, last_name, email, pwd, admin } = req.body;

    const newUser = new User({
        first_name,
        last_name,
        email,
        pwd,
        admin
    });

    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.pwd, salt, (err, hash) => {
            if (err) throw err;
            newUser.pwd = hash;
            const { email, pwd } = newUser
            const token = jwt.sign({ email: email, pwd: pwd }, process.env.ACCESS_TOKEN_SECRET);
            newUser
                .save()
                .then(user => {
                    res.render('login', { token, admin: varjs.getAdmin(), loggedin: varjs.getLoggedin() })
                })
                .catch(err => console.log(err));
        });
    });

    varjs.setLoggedinYes()
    if (newUser.admin == 'yes')
        varjs.setAdminYes()
    else
        varjs.setAdminNo()

    Food.find({}, (err, result) => {
        if (err) throw err;
        res.render('index', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result })
    })

    //res.render('index', { loggedin, admin })
}

const postLogin = (req, res, next) => {
    const user = {
        email: req.body.email,
        pwd: req.body.pwd
    };
    User.findOne({ email: user.email }, async (err, result) => {
        if (err) throw err;

        if (!result) {
            //console.log(result)
            res.json({ msg: "Can't find Email Address" })
        }
        else try {
            //console.log(`result = ${result[0]['pwd']}`)
            const cond = await bcryptjs.compare(req.body.pwd, result.pwd);
            if (cond) {
                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

                varjs.setLoggedinYes()
                    console.log(result.admin)
                    if (result.admin == 'yes')
                        varjs.setAdminYes()
                    else
                        varjs.setAdminNo()
                    Food.find({}, (err, result) => {
                        if (err) throw err
                        res.render('index', { token, admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result })
                    })
                



                // Food.find({}, (err, result) => {
                //     if (err) throw err;
                //     res.render('index', { token, admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result })
                // })
                //res.render('index', { token, admin, loggedin })
            } else {
                res.json({ msg: "Wrong password" });
            }
        } catch {
            res.status(500).json("failed")
        }
    })


}
const getLogout = (req, res, next) => {

    req.logout((err) => {
        if (err) { return next(err); }
        varjs.setAdminNo();
        varjs.setLoggedinNo()
        Food.find({}, (err, result) => {
            if (err) throw err
            res.render('index', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result })
        })
    });
}
module.exports = {
    getIndex,
    getContactPage,
    postContact,
    getFoods,
    getAdminDashboard,
    getLogin,
    getRegister,
    postRegister,
    postLogin,
    getLogout
}