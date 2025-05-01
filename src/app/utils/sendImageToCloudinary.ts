import { v2 as cloudinary } from "cloudinary";

export const sendImageToCloudinary = () => {
  cloudinary.config({
    cloud_name: "drdxbxgll",
    api_key: "934594119949199",
    api_secret: "v_LHJbbodNnRQYb2pge9yyiTY88",
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
