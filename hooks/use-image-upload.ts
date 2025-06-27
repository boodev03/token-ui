
import { uploadApi } from '@/api/upload.api';
import { useMutation } from '@tanstack/react-query';

export const useImageUpload = () => {
    return useMutation({
        mutationFn: async (file: File): Promise<string> => {
            try {

                // Step 1: Get presigned URL
                const urlResponse = await uploadApi.generateUploadUrl(file);

                // Step 2: Upload directly to R2
                await uploadApi.uploadToR2(urlResponse.data.uploadUrl, file);


                // Return public URL
                return urlResponse.data.fileUrl;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
        },
        onError: () => {
        }
    });
};

export const useImageDelete = () => {
    return useMutation({
        mutationFn: (imageUrl: string) => uploadApi.deleteImage(imageUrl)
    });
};