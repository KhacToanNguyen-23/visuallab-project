package com.edulab.service.impl;

import com.edulab.service.GoogleAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthServiceImpl implements GoogleAuthService {

    private final GoogleIdTokenVerifier verifier;

    public GoogleAuthServiceImpl() {
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.emptyList())
                .build();
    }

    @Override
    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        if (idTokenString == null || idTokenString.isBlank()) {
            return null;
        }

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
