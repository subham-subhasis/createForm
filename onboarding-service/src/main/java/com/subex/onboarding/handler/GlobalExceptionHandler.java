package com.subex.onboarding.handler;

import javax.persistence.EntityNotFoundException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.subex.onboarding.exception.PartnerAlreadyExistException;
import com.subex.onboarding.exception.UserNotExistException;
import com.subex.onboarding.model.Response;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
	
	@ExceptionHandler(PartnerAlreadyExistException.class )
	public ResponseEntity<Response> handleException(PartnerAlreadyExistException ex){
		Response response = new Response();
		response.setStatus(ex.getLocalizedMessage());
		response.setStatusCode(HttpStatus.NOT_ACCEPTABLE+"");
		return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
		
		}
	
	@ExceptionHandler(UserNotExistException.class )
	public ResponseEntity<Response> handleException(UserNotExistException ex){
		Response response = new Response();
		response.setStatus(ex.getLocalizedMessage());
		response.setStatusCode(HttpStatus.NOT_ACCEPTABLE+"");
		return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
		
		}
	
	@ExceptionHandler(DataIntegrityViolationException.class )
	public ResponseEntity<Response> handleException(DataIntegrityViolationException ex){
		Response response = new Response();
		response.setStatus("Duplicate data not allowed");
		response.setStatusCode(HttpStatus.NOT_ACCEPTABLE+"");
		return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
		
		}
	
	
	@ExceptionHandler(EmptyResultDataAccessException.class )
	public ResponseEntity<Response> handleException(EmptyResultDataAccessException ex){
		Response response = new Response();
		response.setStatus("No data exist");
		response.setStatusCode(HttpStatus.NOT_FOUND+"");
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		
		}
	
	
	@ExceptionHandler(EntityNotFoundException.class )
	public ResponseEntity<Response> handleException(EntityNotFoundException ex){
		Response response = new Response();
		response.setStatus("No entity found for this Id");
		response.setStatusCode(HttpStatus.NOT_FOUND+"");
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		
		}
	
	
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(
			MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
		Response response = new Response();
		response.setStatus("Method arguments are not valid");
		response.setStatusCode(HttpStatus.BAD_REQUEST+"");
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);	
		}
	
	@ExceptionHandler(Unauthorized.class )
	public ResponseEntity<Object> unAuthorizedException(
			String em) {
		Response response = new Response();
		response.setStatus(em);
		response.setStatusCode(HttpStatus.UNAUTHORIZED+"");
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);	
		}
	
	
}
