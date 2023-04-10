import express from 'express';
const router = express.Router();
import multer from 'multer';
import controller from '../Controllers/productController.js';
import path from 'path';
import fs from 'fs';

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
//   });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // create the uploads directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
  
  const upload = multer({ storage: storage });

router.get('/', controller.getAll);
router.get('/pag', controller.getPagination);
router.get('/:id', controller.get);
router.post('/', upload.array('images', 10), controller.post);
// router.post('/', controller.post);
router.put('/:id', controller.put);
router.delete('/:id', controller.delete);


export default router;