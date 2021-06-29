package com.subex.onboarding;


import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;

import com.subex.ngp.audit.trail.lib.AuditHelper;


@Configuration
public class MdcLogInterceptor  implements HandlerInterceptor
{
	

	private static final String CORRELATION_ID_HEADER_NAME = "X-Correlation-Id";
	private static final String CORRELATION_ID_LOG_VAR_NAME = "correlationId";
	private static final String USER_NAME_LOG_VAR_NAME = "userId";
	private static final String SESSION_ID_LOG_VAR_NAME = "sessionId";
	private static final String SERVICE_NAME_LOG_VAR_NAME = "serviceName";
	private static final Logger log = LoggerFactory.getLogger(MdcLogInterceptor.class);

	@Value("${ngp.register.service.id}")
	private String serviceName;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		final String correlationId = getCorrelationIdFromHeader(request);

		MDC.put(CORRELATION_ID_LOG_VAR_NAME, correlationId == null ? "NULL" : correlationId);

		String userName = request.getHeader("userName");
		if(userName != null) {
			MDC.put(USER_NAME_LOG_VAR_NAME, userName);
		}
//		if (request.getUserPrincipal() != null) {
//			MDC.put(USER_NAME_LOG_VAR_NAME,
//					request.getUserPrincipal().getName() == null ? "NULL" : request.getUserPrincipal().getName());
//		}
		if (request.getSession() != null) {
			MDC.put(SESSION_ID_LOG_VAR_NAME,
					request.getSession().getId() == null ? "NULL" : request.getSession().getId());
		}

		MDC.put(SERVICE_NAME_LOG_VAR_NAME, serviceName == null ? "NULL" : serviceName);
		return true;

	}

	@Override
	public void afterCompletion(final HttpServletRequest request, final HttpServletResponse response,
			final Object handler, final Exception ex) throws Exception {
		String userName = null;
		String path = null;
		String apiName = null;
		String remoteAddress = null;
		if (request != null) {
//			if (request.getUserPrincipal() != null)
//				userName = request.getUserPrincipal().getName() == null ? "NULL" : request.getUserPrincipal().getName();
			userName = request.getHeader("userName")== null ? "NULL" : request.getHeader("userName").toString();
			path = request.getRequestURL() == null ? "NULL" : request.getRequestURL().toString();
			apiName = request.getRequestURI() == null ? "NULL" : request.getRequestURI();
			remoteAddress = request.getRemoteAddr() == null ? "NULL" : request.getRemoteAddr();
		}

		log.info(AuditHelper.log,
				"audit_logged_in_user :: {} || audit_path :: {} || audit_api_name :: {} || audit_service :: {} || audit_remote_address :: {} || audit_status_code :: {} || audit_locale :: {} || audit_date :: {} || audit_log_type :: {}",
				userName, path, apiName, serviceName, remoteAddress, response.getStatus(), response.getLocale(),
				new Date(), "API Log");
		MDC.clear();
	}

	private String getCorrelationIdFromHeader(final HttpServletRequest request) {

		String correlationId = request.getHeader(CORRELATION_ID_HEADER_NAME);

		if (correlationId == null) {

			correlationId = generateUniqueCorrelationId();
		} else {
			correlationId += "-" + generateUniqueCorrelationId();
		}

		return correlationId;

	}

	private String generateUniqueCorrelationId() {

		return UUID.randomUUID().toString();

	}

}


	

