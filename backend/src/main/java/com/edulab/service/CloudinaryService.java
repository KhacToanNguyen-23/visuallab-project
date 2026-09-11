package com.edulab.service;

public interface CloudinaryService {

    record UploadResult(String url, String publicId) {}

    UploadResult uploadBase64Image(String base64Data, String folder);
    
    boolean deleteImage(String publicId);
}
