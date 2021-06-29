package com.subex.onboarding.standard;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class HttpRequestTest {

	/*
	 * @LocalServerPort private int port;
	 * 
	 * @Autowired private TestRestTemplate restTemplate;
	 * 
	 * @SuppressWarnings({ "unchecked", "rawtypes" })
	 * 
	 * @Test public void shouldReturnPasswdEntryFromEtc() throws Exception {
	 * assertThat(this.restTemplate.getForObject("http://localhost:" + port +
	 * "/api/files", List.class)).anyMatch(e -> ((String) ((HashMap)
	 * e).get("name")).contentEquals("passwd")); }
	 */
}
