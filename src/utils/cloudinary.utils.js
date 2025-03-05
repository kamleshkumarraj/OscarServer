import { v2 as cloudinary } from "cloudinary";
import { v1 as uuid } from "uuid";

export const uploadOnCloudinary = async (files = []) => {
  try {
    const result = files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          file,
          {
            resource_type: "auto",
            folder: "TestServer",
          },
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
    });
    const imgResult = await Promise.all(result);
    const imageData = imgResult.map((img) => ({
      public_id: img.public_id,
      url: img.secure_url,
    }));

    return { success: true, data: imageData };
  } catch (error) {
    console.log(error)
    return { success: false, data: error.message };
  }
};

export const deleteOnCloudinary = async (public_id = []) => {
  try {
    const result = public_id.map((id) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(id, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    });
    const dataRes = await Promise.all(result);
    return { success: true, data: dataRes };
  } catch (error) {
    return { success: false, data: "Something went wrong" };
  }
};
