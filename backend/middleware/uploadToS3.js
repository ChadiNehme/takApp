import multer from "multer";
import multerS3 from "multer-s3";
import s3Client from "../utils/s3Client.js";
import dotenv from 'dotenv'
dotenv.config()
const uploadToS3 = (fields = []) => {
    const multerFields = fields.map(({ name }) => ({
        name,
        maxCount: 1,
    }));

    const storage = multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const field = fields.find(f => f.name === file.fieldname);
            const folder = field?.folder || "misc";
            const timestamp = Date.now();
            const fileName = `${folder}/${timestamp}-${file.originalname}`;
            cb(null, fileName);
        }
    });

    return multer({ storage }).fields(multerFields);
};

export default uploadToS3;
