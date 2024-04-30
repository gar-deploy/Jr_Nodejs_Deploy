
import fs from "fs"
import fileModel from '../model/fileModel.js';

//************************************ UPLOAD FILE ********************************** */

export const uploadFile = async (req, res) => {

  try {
    // Validation
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: false, error: 'No file uploaded' });
    }

    const owner = req.user._id  // User's ObjectId

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      owner: owner
    }));

    const uploadingFiles = await fileModel.create(uploadedFiles);

    const files = uploadingFiles.map(file => ({
      filename: file.filename,
      size: file.size,
      path: file.path,
      mimetype: file.mimetype
    }));

    res.status(200).json({ status: true, message: 'File uploaded successfully', data: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }

}


//******************************************** GET FILES ************************************ */

export const getFiles = async (req, res) => {
  try {

    const authUser = req.user._id

    const gettingFiles = await fileModel.find({ owner: authUser, isDeleted: false });
    if (!gettingFiles.length) {
      return res.status(400).json({ status: false, error: "No files found" });
    }

    const files = gettingFiles.map(file => ({
      filename: file.filename,
      size: file.size,
      path: file.path,
      mimetype: file.mimetype
    }));



    res.status(200).json({ status: true, message: 'Success', data: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};



export const deleteFile = async (req, res) => {
  try {
    const deletingFileName = req.params.nameOfFile
    const authUser = req.user._id;


    const file = await fileModel.findOneAndUpdate({ owner: authUser, filename: deletingFileName, isDeleted: false }, { isDeleted: true }, { new: true });

    if (!file) {
      res.status(400).json({ status: false, error: `File with name ${deletingFileName} is not present` })
    } else {

      fs.unlinkSync(`uploads/${file.filename}`);
      res.status(200).json({ status: true, message: `File ${file.filename} is deleted successfully` });
    }

  } catch (error) {

    console.error(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};
