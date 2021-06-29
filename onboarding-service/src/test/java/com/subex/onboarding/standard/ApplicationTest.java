package com.subex.onboarding.standard;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ApplicationTest {

	/*
	 * @Autowired private MockMvc mockMvc;
	 * 
	 * @Test public void shouldReturnPasswdEntryFromEtc() throws Exception {
	 * this.mockMvc.perform(get("/api/files").accept("application/json")).andExpect(
	 * status().isOk())
	 * .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
	 * .andExpect(jsonPath("$").isArray())
	 * .andExpect(jsonPath("$[?(@.name == 'passwd')]").exists()); }
	 */
}
