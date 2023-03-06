 const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: 'postImages/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
      }
})

const uploader = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('this is from uploader', file.originalname)
        const supportedImage = /jpg|png/;
        const extension = path.extname(file.originalname);
        if(supportedImage.test(extension)){
            cb(null, true);
        }
        else{
            cb(new Error('Image must be a png/jpg')) 
        }
    },
    limits: {
        fileSize: 10000000
    }
});


module.exports = uploader; 