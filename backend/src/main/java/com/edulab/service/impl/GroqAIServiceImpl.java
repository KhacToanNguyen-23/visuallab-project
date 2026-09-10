package com.edulab.service.impl;

import com.edulab.service.GroqAIService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqAIServiceImpl implements GroqAIService {

    @Value("${groq.api-key:}")
    private String apiKey;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String generatePedagogicalFeedback(String problemTitle, String parametersJson, String studentSubmittedAnswersJson, String studentExplanation, double mathScore, boolean mathWithinTolerance) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return generateFallbackFeedback(mathScore, mathWithinTolerance, studentExplanation);
        }

        try {
            String url = "https://api.groq.com/openai/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            String prompt = String.format(
                    "You are an expert Physics teacher evaluating a student's lab submission.\n" +
                    "Problem: %s\n" +
                    "Assigned Student Parameters: %s\n" +
                    "Student Submitted Answers: %s\n" +
                    "Student Step-by-Step Explanation: %s\n" +
                    "Math Accuracy Score: %.1f/100 (Within Tolerance: %s)\n\n" +
                    "Respond ONLY with a valid JSON object matching this structure:\n" +
                    "{\n" +
                    "  \"aiReasoningScore\": 85.0,\n" +
                    "  \"misconceptions\": [\"Explanation of any physics misconception identified\"],\n" +
                    "  \"pedagogicalFeedback\": \"Constructive feedback for the student in Vietnamese\",\n" +
                    "  \"suggestions\": \"Suggestions for future experimental measurement\"\n" +
                    "}",
                    problemTitle, parametersJson, studentSubmittedAnswersJson, studentExplanation, mathScore, mathWithinTolerance
            );

            Map<String, Object> body = new HashMap<>();
            body.put("model", modelName);
            body.put("response_format", Map.of("type", "json_object"));

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            String responseStr = restTemplate.postForObject(url, entity, String.class);

            JsonNode root = objectMapper.readTree(responseStr);
            String content = root.path("choices").get(0).path("message").path("content").asText();

            return content;
        } catch (Exception e) {
            return generateFallbackFeedback(mathScore, mathWithinTolerance, studentExplanation);
        }
    }

    private String generateFallbackFeedback(double mathScore, boolean mathWithinTolerance, String studentExplanation) {
        double aiReasoningScore = studentExplanation != null && studentExplanation.length() > 20 ? 85.0 : 60.0;
        String feedback = mathWithinTolerance
                ? "Bài làm kết quả đo đạc chính xác nằm trong dải sai số cho phép! Lời giải logic và đáp ứng tốt yêu cầu bài lab."
                : "Kết quả đo đạc còn chênh lệch so với giá trị lý thuyết. Hãy kiểm tra lại thao tác bấm giờ và vị trí cân bằng.";

        return String.format(
                "{\n" +
                "  \"aiReasoningScore\": %.1f,\n" +
                "  \"misconceptions\": [],\n" +
                "  \"pedagogicalFeedback\": \"%s\",\n" +
                "  \"suggestions\": \"Nên tiến hành đo lặp lại 3 lần để lấy giá trị trung bình chu kỳ T.\"\n" +
                "}",
                aiReasoningScore, feedback
        );
    }
}
