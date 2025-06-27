import axiosInstance from "@/config/axios";

interface GenerateUploadUrlResponse {
    success: boolean;
    data: {
        uploadUrl: string;
        fileUrl: string;
        key: string;
        expiresIn: number;
        instructions: {
            method: string;
            headers: {
                'Content-Type': string;
            };
        };
    };
}

export const uploadApi = {
    // Generate presigned URL
    generateUploadUrl: async (file: File): Promise<GenerateUploadUrlResponse> => {
        const response = await axiosInstance.post('/api/upload/presigned-url', {
            fileName: file.name,
            fileSize: file.size,
            contentType: file.type
        });
        return response.data;
    },

    // Upload file directly to R2
    uploadToR2: async (uploadUrl: string, file: File): Promise<any> => {
        const response = await axiosInstance.put(uploadUrl, file);

        return response.data;
    },

    // Delete image
    deleteImage: async (imageUrl: string) => {
        const response = await axiosInstance.delete('/api/upload/image', {
            data: { imageUrl }
        });
        return response.data;
    }
};