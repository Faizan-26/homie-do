

const config = {
    cloudinary: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
        apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        folder: 'homie-doo-uploads',
    },
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000', // This is the base URL for the API of backend will be used when backend is deployed
    },
    supportedFileTypes: {
        image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        presentation: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        other: ['text/plain', 'application/zip']
    },
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
};

export default config; 