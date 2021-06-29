package com.subex.onboarding.standard;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;


@ExtendWith(SpringExtension.class)
@SpringBootTest 
public class WebMockTest {

	/*@Autowired
	private MockMvc mockMvc;

	@MockBean
	private FilesService service;

	@Test
	public void shouldReturnPasswdEntryFromEtc() throws Exception {
		List<FileEntry> r = new ArrayList<FileEntry>();
		r.add(new FileEntry().name("passwd"));
		ResponseEntity<List<FileEntry>> stubbedValue = new ResponseEntity<List<FileEntry>>(r, HttpStatus.OK);
		when(service.findFiles(any(), any(), any())).thenReturn(stubbedValue);
		this.mockMvc.perform(get("/api/files").accept("application/json")).andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$").isArray()).andExpect(jsonPath("$[?(@.name == 'passwd')]").exists());
	}*/
	
}
