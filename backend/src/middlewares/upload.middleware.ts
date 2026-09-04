import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",

    // PDF
    "application/pdf",

    // DOC / DOCX
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // XLS / XLSX
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // TXT
    "text/plain",

    // ZIP
    "application/zip",
    "application/x-zip-compressed",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
  },
});

export default upload;