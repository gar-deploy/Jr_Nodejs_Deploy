
import mongoose from "mongoose";
import fs from "fs"
import fileModel from '../model/fileModel.js';

// Set up Multer storage

export const uploadFile = async (req, res) => {


  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { filename, mimetype, size } = req.file;
  const path = req.file.path;
  const owner = req.user._id

  try {
    const fileMetadata = new fileModel({
      filename,
      mimetype,
      size,
      path,
      owner
    });
    await fileMetadata.save();

    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

}


export const getFiles = async (req, res) => {
  try {

    const authUser = req.user._id

    const files = await fileModel.find({ owner: authUser, isDeleted: false });
    if (!files.length) {
      return res.send({ message: "No file found" })
    }
    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const deleteFile = async (req, res) => {
  try {
    const deletingFileId = req.params.id
    const authUser = req.user._id;


    const isValidObjectId = mongoose.Types.ObjectId.isValid(deletingFileId);
    console.log(isValidObjectId);

    if (!isValidObjectId) {
      res.send({ message: `${deletingFileId} is not a valid Object ID` })
    }
    const file = await fileModel.findOneAndUpdate({ owner: authUser, _id: deletingFileId, isDeleted: false }, { isDeleted: true }, { new: true });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    fs.unlinkSync(`uploads/${file.filename}`);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
