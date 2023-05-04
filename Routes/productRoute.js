import express from "express";
const router = express.Router();
import multer from "multer";
import controller from "../Controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

  
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
       
//         const timestamp = Date.now();
//         const fileName = `${timestamp}-${file.originalname}`;
//         cb(null, fileName);
//     },
//   });

//   const upload = multer({ 
//     storage: storage,
//     fileFilter: function(req, file, callback){
//         if(
//             file.mimetype == "image/png" ||
//             file.mimetype == "image/jpg" ||
//             file.mimetype == "image/jpeg"
//         ){
//             callback(null, true)
//         }else {
//             console.log("only jpg and png file supported!")
//             callback(null, false)
//         }
//     },
//     limits: {
//         fileSize: 1024 * 1024 * 2
//     }

//  })

router.get("/", controller.getAll);
router.get("/pag", controller.getPagination);
router.get("/search", controller.search);
router.get("/list1/:id", controller.getProductsBySubcategory);
router.get("/list2/:id", controller.getProductsByCategory);
router.get("/sale", controller.getAllDiscountedProducts);
router.get("/:id", controller.get);
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), controller.post);
// router.post('/', controller.post);
router.put("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), controller.put);
router.delete("/:id", controller.delete);

export default router;




// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = "./uploads";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir); // create the uploads directory if it doesn't exist
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });


// let ext = path.extname(file.originalname)
// cb(null, Date.now() + ext);