import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image file."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
const validateImageSignature = (req, res, next) => {
  // If no file was uploaded, just move on (let the controller handle if it's required)
  if (!req.file && (!req.files || req.files.length === 0)) {
    return next();
  }

  // Helper to check a single file's buffer
  const checkMagicNumber = (buffer) => {
    // Read the first 4 bytes and convert to uppercase hex
    const magic = buffer.toString("hex", 0, 4).toUpperCase();
    
    // JPEG starts with FFD8FF, PNG starts with 89504E47
    return magic.startsWith("FFD8FF") || magic === "89504E47";
  };

  // Handle single file upload
  if (req.file) {
    if (!checkMagicNumber(req.file.buffer)) {
      return res.status(400).json({ error: "Invalid file content detected. Spoofed file!" });
    }
  }

  // Handle multiple files upload (if your app uses upload.array)
  if (req.files) {
    for (const file of req.files) {
      if (!checkMagicNumber(file.buffer)) {
        return res.status(400).json({ error: "Invalid file content detected. Spoofed file!" });
      }
    }
  }

  next(); // All files passed the magic number check!
};
export { upload, validateImageSignature };
};
