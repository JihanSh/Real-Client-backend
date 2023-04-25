import express from "express";
const router = express.Router();
import multer from "multer";
import controller from "../Controllers/productController.js";
import path from "path";
  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
      cb(null, Date.now() + ext);
    },
  });

  const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, callback){
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ){
            callback(null, true)
        }else {
            console.log("only jpg and png file supported!")
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }

 })

router.get("/", controller.getAll);
router.get("/pag", controller.getPagination);
router.get("/search", controller.search);
router.get("/list1/:id", controller.getProductsBySubcategory);
router.get("/list2/:id", controller.getProductsByCategory);
router.get("/:id", controller.get);
router.post("/", upload.array("images"), controller.post);
// router.post('/', controller.post);
router.put("/:id", upload.array("images"), controller.put);
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