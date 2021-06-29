package com.subex.onboarding.helper;

import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.subex.ngp.audit.trail.lib.AuditHelper;
@Aspect
@Configuration
public class AuditAspect {

	@Value("${ngp.register.service.id}")
	private String serviceName;



	private static final Logger log = LoggerFactory.getLogger(AuditAspect.class);


	//@Around("execution(* com.subex.ngp.data.table.search.service.impl.*.*(..))")
	@Before("execution(* com.subex.onboarding.service.*.*(..))")
	public void before(JoinPoint joinPoint) {
		HashMap<String,Object > mp = new HashMap<>();
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		String userName = request.getHeader("userName");
		String path = "NULL";
		String apiName = "NULL";
		String locale = "NULL";
//		if(request!=null&&request.getUserPrincipal() != null  && request.getUserPrincipal().getName()!=null)
//		{
//			userName= request.getUserPrincipal().getName();
//		}
		if(request!=null && request.getRequestURL()!=null)
		{
			path=request.getRequestURL().toString();
		}

		if(request!=null && request.getRequestURI()!=null)
		{
			apiName = request.getRequestURI();
		}
		if(request!=null && request.getLocale().toString()!=null)
		{
			locale = request.getLocale().toString();
		}
		
		MethodSignature method = (MethodSignature)joinPoint.getSignature();
		String[] parameters = method.getParameterNames();
		for (int t = 0; t< parameters.length; t++) {
			if( Objects.nonNull(parameters[t])) {
				Object[] obj = joinPoint.getArgs();
				if(obj[t] != null) {
					mp.put(parameters[t]+" ", " "+obj[t]);
				}
			}
		}

		log.info(AuditHelper.log,"audit_logged_in_user :: {} || audit_path :: {} || audit_date :: {} || audit_api_name :: {} || audit_service :: {} || audit_api_method_name :: {} || audit_remote_address :: {} || audit_parameter_list :: {} || audit_locale :: {} || audit_log_type :: {}",
				userName,path,new Date(),apiName,serviceName,joinPoint.getSignature().getName(),request.getRemoteAddr(),"",locale, "API Log");


	}

}
