// Cloudinary Upload Service with Compression Optimization

// Generate optimized image URL with compression
export const getOptimizedImageUrl = (publicId, width = 600) => {
  if (!publicId) return null;
  // Transforms: quality auto, fetch format auto, width constraint, crop
  return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,q_auto:best,f_auto,w_${width}/${publicId}`;
};

// Generate optimized video URL with 720p compression
export const getOptimizedVideoUrl = (publicId) => {
  if (!publicId) return null;
  // Transforms: video codec h.264, quality auto, bitrate 2500k (moderate), height 720, aspect ratio preserved
  return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/video/upload/c_scale,h_720,q_auto:best,vc_h264,b_2500k/${publicId}`;
};

const parseCloudinaryError = async (response, fallbackMessage) => {
  try {
    const errorData = await response.json();
    return errorData?.error?.message || errorData?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(await parseCloudinaryError(response, 'Upload failed'));
    }

    const data = await response.json();
    return {
      success: true,
      url: getOptimizedImageUrl(data.public_id),
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      size: data.bytes,
      originalSize: data.bytes,
      format: data.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Upload video with compression to 720p
export const uploadVideoToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(await parseCloudinaryError(response, 'Video upload failed'));
    }

    const data = await response.json();
    return {
      success: true,
      url: getOptimizedVideoUrl(data.public_id),
      publicId: data.public_id,
      mediaType: 'video',
      duration: data.duration,
      width: data.width,
      height: data.height,
      size: data.bytes,
    };
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
