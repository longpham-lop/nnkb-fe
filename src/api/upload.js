import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

/**
 * Upload file (image) lên server / Cloudinary
 * @param {File} file - file image
 * @returns {Promise} - trả về { message, url, public_id }
 */
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return axiosInstance.post(`${API}/api/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
