package com.subex.onboarding.utility;

import com.auth0.jwt.interfaces.DecodedJWT;

public interface IAuthTokenValidator {

  
  DecodedJWT getDecodedJWT(String paramString) throws Exception;
  
  void validateSignature(String paramString) throws Exception;
  
  void validateClaims(String paramString) throws Exception;
}