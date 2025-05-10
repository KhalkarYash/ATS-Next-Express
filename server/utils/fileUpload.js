const fs = require('fs').promises;
const path = require('path');
const { AppError } = require('../middleware/errorHandler');

// Allowed file types
const ALLOWED_FILE_TYPES = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validate file type and size
const validateFile = (file) => {
    if (!file) {
        throw new AppError('No file uploaded', 400);
    }

    if (!ALLOWED_FILE_TYPES[file.mimetype]) {
        throw new AppError('Invalid file type. Only PDF, DOC, and DOCX files are allowed', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new AppError('File size too large. Maximum size is 5MB', 400);
    }

    return true;
};

// Generate secure filename
const generateSecureFilename = (originalname) => {
    const extension = ALLOWED_FILE_TYPES[file.mimetype];
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomString}${extension}`;
};

// Save file to disk
const saveFile = async (file, directory = 'uploads') => {
    try {
        const uploadDir = path.join(__dirname, '..', directory);
        
        // Create directory if it doesn't exist
        await fs.mkdir(uploadDir, { recursive: true });

        const filename = generateSecureFilename(file.originalname);
        const filepath = path.join(uploadDir, filename);
        
        await fs.writeFile(filepath, file.buffer);
        
        return {
            filename,
            filepath,
            size: file.size,
            mimetype: file.mimetype
        };
    } catch (error) {
        throw new AppError('Error saving file', 500);
    }
};

// Delete file from disk
const deleteFile = async (filepath) => {
    try {
        await fs.unlink(filepath);
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

// Clean up temporary files older than 24 hours
const cleanupTempFiles = async (directory = 'uploads/temp') => {
    try {
        const tempDir = path.join(__dirname, '..', directory);
        const files = await fs.readdir(tempDir);
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        for (const file of files) {
            const filepath = path.join(tempDir, file);
            const stats = await fs.stat(filepath);
            
            if (now - stats.mtimeMs > ONE_DAY) {
                await fs.unlink(filepath);
            }
        }
    } catch (error) {
        console.error('Error cleaning up temp files:', error);
    }
};

module.exports = {
    validateFile,
    saveFile,
    deleteFile,
    cleanupTempFiles
};