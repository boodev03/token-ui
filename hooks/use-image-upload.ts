
import { uploadApi } from '@/api/upload.api';
import { useMutation } from '@tanstack/react-query';

export const useImageUpload = () => {
    return useMutation({
        mutationFn: async (file: File): Promise<string> => {
            try {

                const urlResponse = await uploadApi.generateUploadUrl(file);

                await uploadApi.uploadToR2(urlResponse.data.uploadUrl, file);

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