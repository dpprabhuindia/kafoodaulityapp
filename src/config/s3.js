const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

if (!BUCKET_NAME) {
  console.warn('Warning: AWS_S3_BUCKET_NAME not set. S3 uploads will fail.');
}

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} key - S3 object key (path)
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} - S3 object URL
 */
const uploadToS3 = async (fileBuffer, key, contentType) => {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      // ACL is optional - uncomment if your bucket supports it and you want public access
      // ACL: 'public-read',
    });

    await s3Client.send(command);

    // Return the public URL
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

/**
 * Delete a file from S3
 * @param {string} key - S3 object key (path)
 * @returns {Promise<void>}
 */
const deleteFromS3 = async (key) => {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  try {
    // Extract key from full URL if provided
    const s3Key = key.includes('amazonaws.com/') 
      ? key.split('amazonaws.com/')[1] 
      : key;

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
};


/**
 * Generate S3 key (path) for a photo
 * @param {string} schoolId - School ID
 * @param {string} photoType - Type of photo (inspection, facility, warden)
 * @param {string} filename - Filename
 * @param {string} inspectionId - Optional inspection ID
 * @param {string} facilityType - Optional facility type
 * @returns {string} - S3 key
 */
const generateS3Key = (schoolId, photoType, filename, inspectionId = null, facilityType = null) => {
  const sanitize = (str) => (str || '').toString().replace(/[^a-zA-Z0-9-_]/g, '_');
  
  const schoolSegment = sanitize(schoolId) || 'unknown_school';
  const typeSegment = photoType || 'general';
  
  let path = `photos/${schoolSegment}/${typeSegment}`;
  
  if (inspectionId) {
    path += `/inspection_${sanitize(inspectionId)}`;
  } else if (facilityType) {
    path += `/facility_${sanitize(facilityType)}`;
  }
  
  path += `/${sanitize(filename)}`;
  
  return path;
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  generateS3Key,
  BUCKET_NAME,
};

