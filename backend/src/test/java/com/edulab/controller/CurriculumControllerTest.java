package com.edulab.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CurriculumControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void shouldReturnAllTopics() throws Exception {
        mockMvc.perform(get("/api/curriculum/topics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].id").value("dien-hoc"))
                .andExpect(jsonPath("$[0].title").value("Điện học & Mạch Điện DC"));
    }

    @Test
    public void shouldReturnTopicById() throws Exception {
        mockMvc.perform(get("/api/curriculum/topics/dien-hoc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("dien-hoc"))
                .andExpect(jsonPath("$.subjectArea").value("Điện học"));
    }

    @Test
    public void shouldReturn404ForUnknownTopic() throws Exception {
        mockMvc.perform(get("/api/curriculum/topics/unknown-id"))
                .andExpect(status().isNotFound());
    }
}
