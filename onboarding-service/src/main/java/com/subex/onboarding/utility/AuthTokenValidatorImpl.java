package com.subex.onboarding.utility;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.security.interfaces.RSAPublicKey;
import java.util.Arrays;
import java.util.Map;

public class AuthTokenValidatorImpl implements IAuthTokenValidator {
  private RSAPublicKey publicKeyContent;
  
  public AuthTokenValidatorImpl(IKeyContentFetcher keyContentFetcher) throws Exception {
    this.publicKeyContent = keyContentFetcher.getPublicKeyContent();
  }
  
  public DecodedJWT getDecodedJWT(String jwtToken) throws Exception {
    if (this.publicKeyContent == null)
      throw new Exception("Failed to build validate JWT token. PublicKeyContent key found be null."); 
    Algorithm algorithm = Algorithm.RSA256(this.publicKeyContent, null);
    JWTVerifier verifier = JWT.require(algorithm).acceptLeeway(1).acceptExpiresAt(5 * 60L).build();
    return verifier.verify(jwtToken);
  }
  
  public final void validateSignature(String jwtToken) throws Exception {
    try {
      getDecodedJWT(jwtToken);
    } catch (Exception exp) {
      //throw exp;
    } 
  }
  
  public void validateClaims(String jwtToken) throws Exception {
    try {
      DecodedJWT decodedJWT = getDecodedJWT(jwtToken);
      System.out.println("Decoded Claims:: Algo : " + decodedJWT.getAlgorithm());
      System.out.println("Decoded Claims:: Content Type : " + decodedJWT.getContentType());
      System.out.println("Decoded Claims:: Issuer : " + decodedJWT.getIssuer());
      System.out.println("Decoded Claims:: Subject : " + decodedJWT.getSubject());
      System.out.println("Decoded Claims:: Audience : " + decodedJWT.getAudience());
    } catch (Exception exp) {
      throw exp;
    } 
  }
  
  public void validateClaims(String jwtToken, Map<Object, Object> extraClaims) throws Exception {
    try {
      DecodedJWT decodedJWT = getDecodedJWT(jwtToken);
      System.out.println("Decoded Claims:: Algo : " + decodedJWT.getAlgorithm());
      System.out.println("Decoded Claims:: Content Type : " + decodedJWT.getContentType());
      System.out.println("Decoded Claims:: Issuer : " + decodedJWT.getIssuer());
      System.out.println("Decoded Claims:: Subject : " + decodedJWT.getSubject());
      System.out.println("Decoded Claims:: Audience : " + decodedJWT.getAudience());
      System.out.println("Decoded extraClaims:: Audience : " + Arrays.<Map>asList(new Map[] { extraClaims }));
    } catch (Exception exp) {
      throw exp;
    } 
  }
}

