const varjs = require('../config/varjs');
const Food = require('../models/Food')
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const { nextTick } = require('process');


// Mongo URI
const mongoURI = 'mongodb://localhost:27017/food';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });


// const Result = (req, res, rend, admin, loggedin) => {
//     Food.find({}, (err, result) => {
//         if (err) throw err;
//         res.render(rend, { admin, loggedin, result })
//     })
// }

const postUpload = (req, res) => {
    const newFood = new Food({
        food_name: req.body.food_name,
        food_price: req.body.food_price,
        food_image_name: req.file.filename,
        food_image_id: String(req.file.id)
    })
    console.log(newFood)
    newFood.save((err, ress) => {
        if (err) throw err;
        res.redirect('/AdminDashboard')
        // Food.find({}, (err, result) => {
        //     if (err) throw err;
        //     res.render('AdminDashboard', { admin: varjs.getAdmin(), loggedin: varjs.getLoggedin(), result })
        // })

    })
}
const getImage = (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
}
const deletImage = (req, res) => {
    console.log(req.params)
    //console.log(gfs.remove)
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) return handleError(err);
    })

    Food.deleteMany({ food_image_id: req.params.id }, (err, resu) => {
        if (err) throw err
        res.redirect('/AdminDashboard')
    })
}




module.exports =
{
    upload,
    postUpload,
    getImage,
    deletImage
}