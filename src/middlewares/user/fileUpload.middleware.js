import multer from 'multer';
import fs from 'fs/promises'
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "src/uploads")
    },
    filename : (req, file, cb) => {
        const filename = Date.now()+"__"+file.originalname;
        cb(null, filename);
    }

})

const fileFilter = (req, file, cb) => {
    const fileTypeList = ["image/png", "image/jpg", "image/jpeg"];
    if(fileTypeList.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(new Error("Invalid file type. Only image files are allowed."), false);
    }
}

export const upload = multer({storage, fileFilter})



