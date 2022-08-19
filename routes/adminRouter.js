const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
//const Food = require('../models/Food')
const adminController = require('../controllers/adminController')
const adminRouter = express.Router();


//@route GET /
//@desc Loads form
// adminRouter.get('/images', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       res.render('index', { files: false });
//     } else {
//       files.map(file => {
//         if (
//           file.contentType === 'image/jpeg' ||
//           file.contentType === 'image/png'
//         ) {
//           file.isImage = true;
//         } else {
//           file.isImage = false;
//         }
//       });
//       console.log(files)
//       res.render('index', {admin:'yes',loggedin:'yes', result: files });
//     }
//   });
// });

// @route POST /upload
// @desc  Uploads file to DB
adminRouter.route('/upload').post(adminController.upload.single('file'), adminController.postUpload);

// @route GET /files
// @desc  Display all files in JSON
// adminRouter.route('/files').get((req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         // Check if files
//         if (!files || files.length === 0) {
//             return res.status(404).json({
//                 err: 'No files exist'
//             });
//         }

//         // Files exist
//         return res.json(files);
//     });
// });

// @route GET /files/:filename
// @desc  Display single file object
// adminRouter.route('/files/:filename').get((req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         // Check if file
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No file exists'
//             });
//         }
//         // File exists
//         return res.json(file);
//     });
// });

// @route GET /image/:filename
// @desc Display Image
adminRouter.route('/image/:filename').get(adminController.getImage);

// @route DELETE /files/:id
// @desc  Delete file
adminRouter.route('/delete/:id').post(adminController.deletImage);




module.exports = adminRouter;
