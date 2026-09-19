package com.edulab.service.impl;

import com.edulab.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "email.mode", havingValue = "mock", matchIfMissing = true)
public class MockEmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(MockEmailServiceImpl.class);

    @Override
    public void sendVerificationEmail(String recipientEmail, String recipientName, String verificationUrl) {
        log.info("\n" +
                "========================================================================================\n" +
                "📧 [MOCK EMAIL SERVICE] TRANSACTIONAL VERIFICATION DISPATCHED\n" +
                "----------------------------------------------------------------------------------------\n" +
                "To:          {} ({})\n" +
                "Subject:     Xác thực tài khoản EduLab của bạn\n" +
                "Action URL:  {}\n" +
                "Expires in:  15 minutes\n" +
                "========================================================================================",
                recipientEmail, recipientName != null ? recipientName : "Học sinh", verificationUrl);
    }
}
