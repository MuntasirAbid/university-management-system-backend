import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import multer from "multer";

export const sendImageToCloudinary = () => {
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  // Upload an image
  cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
    { public_id: "shoes" },
    function (error, result) {
      console.log(result);
    }
  );
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
