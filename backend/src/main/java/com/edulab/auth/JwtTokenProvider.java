package com.edulab.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:EduLabPhysicsSecretKeyForJwtTokenGeneration2026}")
    private String jwtSecret;

    // Access Token lifetime: 15 minutes (900 seconds)
    private static final long ACCESS_TOKEN_VALIDITY_SECONDS = 15 * 60;
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateToken(String userId, String email) {
        String header = base64UrlEncode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long exp = (System.currentTimeMillis() / 1000) + ACCESS_TOKEN_VALIDITY_SECONDS;
        String payload = base64UrlEncode(String.format("{\"sub\":\"%s\",\"email\":\"%s\",\"exp\":%d}", userId, email, exp));

        String signature = sign(header + "." + payload, jwtSecret);
        return header + "." + payload + "." + signature;
    }

    public boolean validateToken(String token) {
        try {
            if (token == null) return false;
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String signature = sign(parts[0] + "." + parts[1], jwtSecret);
            if (!signature.equals(parts[2])) return false;

            // Check expiration
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            int expStart = payloadJson.indexOf("\"exp\":");
            if (expStart != -1) {
                int expEnd = payloadJson.indexOf("}", expStart);
                if (expEnd != -1) {
                    long exp = Long.parseLong(payloadJson.substring(expStart + 6, expEnd).replaceAll("[^0-9]", ""));
                    if ((System.currentTimeMillis() / 1000) > exp) {
                        return false;
                    }
                }
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        try {
            if (token == null) return null;
            String[] parts = token.split("\\.");
            if (parts.length < 2) return null;
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            int emailStart = payloadJson.indexOf("\"email\":\"") + 9;
            int emailEnd = payloadJson.indexOf("\"", emailStart);
            return payloadJson.substring(emailStart, emailEnd);
        } catch (Exception e) {
            return null;
        }
    }

    public String generateRawRefreshToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    public String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
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
