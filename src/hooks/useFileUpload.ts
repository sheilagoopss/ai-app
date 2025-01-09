import FirebaseHelper from "@/helpers/FirebaseHelper";
import { useCallback, useState } from "react";

interface UseImageUploadReturn {
  uploadImages: (images: string[], folder?: string) => Promise<string[]>;
  isUploading: boolean;
}

interface UseFileUploadReturn {
  uploadFiles: (files: File[], folder?: string) => Promise<string[]>;
  isUploading: boolean;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const uploadImages = useCallback(
    async (images: string[], folder = "images"): Promise<string[]> => {
      if (images.length === 0) return [];
      setIsUploading(true);
      const urls = await Promise.all(
        images.map((file) => FirebaseHelper.uploadImage(file, folder)),
      );
      setIsUploading(false);
      // return ["https://i.etsystatic.com/28522475/r/il/81cd62/6229273300/il_1588xN.6229273300_al10.jpg"]
      return urls;
    },
    [],
  );
  return { uploadImages, isUploading };
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const uploadFiles = useCallback(
    async (files: File[], folder = "files"): Promise<string[]> => {
      if (files.length === 0) return [];
      setIsUploading(true);
      const urls = await Promise.all(
        files.map((file) => FirebaseHelper.uploadFileDirect(file, folder)),
      );
      setIsUploading(false);
      return urls;
    },
    [],
  );
  return { uploadFiles, isUploading };
}
