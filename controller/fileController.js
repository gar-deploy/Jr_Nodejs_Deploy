
import fs from "fs"
import fileModel from '../model/fileModel.js';

// Set up Multer storage

export const uploadFile = async (req, res) => {



  // Route to handle file upload
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { filename, mimetype, size } = req.file;
  const path = req.file.path;

  try {
    const fileMetadata = new fileModel({
      filename,
      mimetype,
      size,
      path
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
    const files = await fileModel.find();
    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    // const { _id: owner } = req.user;

    const file = await fileModel.findOneAndDelete({ _id: id });

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
