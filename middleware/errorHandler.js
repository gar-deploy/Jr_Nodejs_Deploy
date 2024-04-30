
import multer from "multer"

export const handleError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_COUNT' || err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ error: 'You can upload at most 5 files' });
        } else if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size should not exceed 15MB' });
        }
    }
    return res.status(500).json({ error: 'Internal server error' });
};
