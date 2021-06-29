package com.subex.onboarding;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

@Component
public class JWTAuthenticationEntryPoint  implements AuthenticationEntryPoint, Serializable {
	private final Logger logger = LogManager.getLogger(JWTAuthenticationEntryPoint.class);
	private static final long serialVersionUID = -7858869558953243875L;
	Gson gson = new Gson();
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException  {
		logger.error("Unauthorized error. Message - {}", authException.getMessage());
		PrintWriter out = response.getWriter();
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setCharacterEncoding("UTF-8");
		out.print(authException.getMessage());
		out.flush();
	}
}