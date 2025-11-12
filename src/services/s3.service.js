const AWS = require("aws-sdk");
const multer = require("multer");

// Configurar Multer para manejar archivos
const upload = multer({
  storage: multer.memoryStorage(),
});

// Configurar AWS S3 (v2)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Función para subir archivo a S3
async function uploadToS3(file, userId) {
  const fileName = `profile_pictures/user_${userId}_${Date.now()}.jpg`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ACL: "public-read",
    ContentType: file.mimetype,
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // URL pública
}

module.exports = {
  upload,
  uploadToS3,
};