package com.edulab.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    private final GoogleIdTokenVerifier verifier;

    public GoogleAuthService() {
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.emptyList()) // Accepts any valid client ID or verify in production
                .build();
    }

    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        if (idTokenString == null || idTokenString.isBlank()) {
            return null;
        }

        // Mock token fallback for local dev / testing without Google Console credentials
        if (idTokenString.startsWith("mock_google_id_token_") || idTokenString.equals("google_auth_token_mock")) {
            GoogleIdToken.Payload mockPayload = new GoogleIdToken.Payload();
            mockPayload.setEmail("google_dev_user@gmail.com");
            mockPayload.set("name", "Người dùng Google Verified");
            mockPayload.setEmailVerified(true);
            return mockPayload;
        }

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (Exception e) {
            System.err.println("Google ID Token verification failed: " + e.getMessage());
        }
        return null;
    }
}
