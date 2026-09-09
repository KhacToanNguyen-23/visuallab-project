package com.edulab.auth;

import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    private static final String SECRET_KEY = "EduLabPhysicsSecretKeyForJwtTokenGeneration2026";

    public String generateToken(String userId, String email) {
        String header = base64UrlEncode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long exp = (System.currentTimeMillis() / 1000) + 86400; // 24 hours
        String payload = base64UrlEncode(String.format("{\"sub\":\"%s\",\"email\":\"%s\",\"exp\":%d}", userId, email, exp));

        String signature = sign(header + "." + payload, SECRET_KEY);
        return header + "." + payload + "." + signature;
    }

    public boolean validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String signature = sign(parts[0] + "." + parts[1], SECRET_KEY);
            return signature.equals(parts[2]);
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            int emailStart = payloadJson.indexOf("\"email\":\"") + 9;
            int emailEnd = payloadJson.indexOf("\"", emailStart);
            return payloadJson.substring(emailStart, emailEnd);
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data, String key) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error signing JWT", e);
        }
    }

    private String base64UrlEncode(String input) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(input.getBytes(StandardCharsets.UTF_8));
    }
}
