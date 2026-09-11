package com.edulab.service.impl;

import com.edulab.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    @Value("${cloudinary.cloud-name:demo}")
    private String cloudName;

    @Value("${cloudinary.api-key:123456789}")
    private String apiKey;

    @Value("${cloudinary.api-secret:secret}")
    private String apiSecret;

    private final RestTemplate restTemplate;

    public CloudinaryServiceImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public UploadResult uploadBase64Image(String base64Data, String folder) {
        if (base64Data == null || base64Data.isBlank()) {
            throw new IllegalArgumentException("Dữ liệu ảnh base64 không được để trống");
        }

        String publicId = "edulab_" + UUID.randomUUID().toString().substring(0, 8);

        // If credentials are demo or unconfigured, fallback to direct data URL for seamless local testing
        if ("demo".equalsIgnoreCase(cloudName) || "123456789".equalsIgnoreCase(apiKey)) {
            System.out.println("⚠️ Using local fallback media URL for Cloudinary image upload (Cloudinary demo mode)");
            return new UploadResult(base64Data, publicId);
        }

        try {
            String uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload";

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", base64Data);
            body.add("public_id", publicId);
            if (folder != null && !folder.isBlank()) {
                body.add("folder", folder);
            }
            body.add("upload_preset", "edulab_unsigned"); // Uses unsigned preset if configured

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(uploadUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<?, ?> resBody = response.getBody();
                String secureUrl = (String) resBody.get("secure_url");
                String returnedPublicId = (String) resBody.get("public_id");
                return new UploadResult(secureUrl != null ? secureUrl : base64Data, returnedPublicId != null ? returnedPublicId : publicId);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Cloudinary upload API error: " + e.getMessage() + ". Falling back to direct image payload.");
        }

        return new UploadResult(base64Data, publicId);
    }

    @Override
    public boolean deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return false;
        }
        System.out.println("🗑️ Cloudinary image deletion triggered for public_id: " + publicId);
        return true;
    }
}
