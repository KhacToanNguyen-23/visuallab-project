package com.edulab.service.impl;

import com.edulab.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@ConditionalOnProperty(name = "email.mode", havingValue = "resend")
public class ResendEmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailServiceImpl.class);

    private final RestClient restClient;
    private final String apiKey;
    private final String fromEmail;

    public ResendEmailServiceImpl(
            @Value("${resend.api-key:}") String apiKey,
            @Value("${resend.from-email:EduLab <onboarding@resend.dev>}") String fromEmail
    ) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .build();
    }

    @Override
    public void sendVerificationEmail(String recipientEmail, String recipientName, String verificationUrl) {
        if (apiKey == null || apiKey.isBlank() || "mock-key".equalsIgnoreCase(apiKey)) {
            log.warn("Resend API Key is missing or invalid. Email not dispatched to: {}", recipientEmail);
            return;
        }

        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;\">" +
                "<h2 style=\"color: #0f172a; margin-bottom: 16px;\">Chào mừng bạn đến với EduLab! 👋</h2>" +
                "<p style=\"color: #334155; font-size: 15px; line-height: 1.6;\">Chào <strong>" + (recipientName != null ? recipientName : "Học sinh") + "</strong>,</p>" +
                "<p style=\"color: #334155; font-size: 15px; line-height: 1.6;\">Bạn vừa yêu cầu đăng ký tài khoản Học sinh trên nền tảng phòng thí nghiệm ảo <strong>EduLab</strong> qua Google.</p>" +
                "<p style=\"color: #334155; font-size: 15px; line-height: 1.6;\">Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email và hoàn tất thiết lập tài khoản:</p>" +
                "<div style=\"text-align: center; margin: 32px 0;\">" +
                "<a href=\"" + verificationUrl + "\" style=\"display: inline-block; padding: 12px 28px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);\">Xác Thực Tài Khoản Ngay</a>" +
                "</div>" +
                "<p style=\"color: #64748b; font-size: 13px; line-height: 1.5;\">Liên kết xác thực này sẽ hết hạn trong vòng <strong>15 phút</strong>. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>" +
                "<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;\" />" +
                "<p style=\"color: #94a3b8; font-size: 12px; text-align: center;\">© EduLab - Phòng thí nghiệm Vật lý ảo thông minh chuẩn GDPT 2018</p>" +
                "</div>";

        try {
            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "from", fromEmail,
                            "to", recipientEmail,
                            "subject", "Xác thực tài khoản EduLab của bạn",
                            "html", htmlContent
                    ))
                    .retrieve()
                    .toBodilessEntity();
            log.info("Successfully sent verification email via Resend to {}", recipientEmail);
        } catch (Exception e) {
            log.warn("Resend API warning/restriction (Testing domain only allows sending to Resend owner email): {}", e.getMessage());
            log.info("\n" +
                    "========================================================================================\n" +
                    "📧 [RESEND FALLBACK URL] LINK XÁC THỰC EMAIL CHO DEV:\n" +
                    "----------------------------------------------------------------------------------------\n" +
                    "To:          {}\n" +
                    "Action URL:  {}\n" +
                    "Expires in:  15 minutes\n" +
                    "========================================================================================",
                    recipientEmail, verificationUrl);
        }
    }
}
