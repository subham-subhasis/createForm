package com.subex.onboarding;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.exceptions.InvalidClaimException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.subex.onboarding.utility.AuthTokenValidatorImpl;
import com.subex.onboarding.utility.DefaultKeyContentFetcher;
import com.subex.onboarding.utility.IAuthTokenValidator;
import com.subex.onboarding.utility.IKeyContentFetcher;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JWTAuthorizationFilter extends OncePerRequestFilter {
	
	private final Logger logger = LogManager.getLogger(JWTAuthorizationFilter.class);
	
	@Value("${publickey.path}")
	private String publicKeyPath;
	@Value("${errorMessage.expireTimeNotSet}")
	private String expireTimeNotSet;
	@Value("${errorMessage.missingAuthorizationBearer}")
	private String missingAuthorizationBearer;
	@Value("${errorMessage.tokenVerificationFailed}")
	private String tokenVerificationFailed;
	private final String HEADER = "Authorization";
	private final String PREFIX = "Bearer ";
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		String errorMessage = "";
		List<String> authorities = new ArrayList<String>();
		boolean isError = true;
		try {
			if ("/api/profiles".equals(request.getRequestURI())
			|| "/api/partnerinfos".equals(request.getRequestURI())
			|| "/api/partnerinfos/savepassword".equals(request.getRequestURI())
			|| "/api/profileinfos".equals(request.getRequestURI())
			|| "/api/profileinfos/{.*}".equals(request.getRequestURI())) {
				isError = false;
				chain.doFilter(request, response);
		    	return;
		    }
			if (checkJWTToken(request, response)) {
			
				logger.debug("checkJWTToken----Token validation successfull");
				String jwtToken = request.getHeader(HEADER).replace(PREFIX, "");
				logger.debug("checkJWTToken----jwtToken"+jwtToken+"  path****   "+ publicKeyPath);
				IKeyContentFetcher keyContentFetcher = new DefaultKeyContentFetcher(publicKeyPath, null);
				IAuthTokenValidator jwtValidator = new AuthTokenValidatorImpl(keyContentFetcher);
				DecodedJWT jwt = jwtValidator.getDecodedJWT(jwtToken);
				String subject = jwt.getSubject();
				if (jwt.getExpiresAt() == null) {
					logger.debug("******expireTimeNotSet");
					errorMessage = expireTimeNotSet;
				} else {
					isError = false;
					UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
							subject,null, authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
							SecurityContextHolder.getContext().setAuthentication(auth);
					logger.info("Token validation successfull");
				}
			} else {
				logger.debug("******missingAuthorizationBearer");
				errorMessage = missingAuthorizationBearer;
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getOutputStream().println("{ \"error\": \"" + errorMessage + "\" }");
				((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, errorMessage);
				SecurityContextHolder.clearContext();
			}
			if (!isError) {
				chain.doFilter(request, response);
			}
		}
		catch (ExpiredJwtException | IllegalArgumentException | UnsupportedJwtException | MalformedJwtException  e) {
			
			logger.error("ExpiredJwtException. Message - {}", e.getMessage());
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType(errorMessage);
			((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
			return;
		}
		catch (TokenExpiredException e) 
		{
			logger.error("TokenExpiredException. Message - {}", e.getMessage());
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType(errorMessage);
			((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
			return;
		}
		catch (InvalidClaimException e)
		{
			logger.error("InvalidClaimException. Message - {}", e.getMessage());
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType(errorMessage);
			((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
			return;
		}
		catch(Exception e)
		{
			logger.error("Exception. Message - {}", e.getMessage());
			e.printStackTrace();
			errorMessage = tokenVerificationFailed;
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType(errorMessage);
			((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, errorMessage);
			return;
		}
	}

	private boolean checkJWTToken(HttpServletRequest request, HttpServletResponse res) {
		String authenticationHeader = request.getHeader(HEADER);
		if (authenticationHeader == null || !authenticationHeader.startsWith(PREFIX))
			return false;
		return true;
	}

}