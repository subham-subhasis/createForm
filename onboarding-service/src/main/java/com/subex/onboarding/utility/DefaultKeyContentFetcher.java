package com.subex.onboarding.utility;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class DefaultKeyContentFetcher implements IKeyContentFetcher {
  String publicKeyFilePath;
  
  String privateKeyFilePath;
  
  public DefaultKeyContentFetcher(String publicKeyFilePath, String privateKeyFilePath) {
    this.publicKeyFilePath = publicKeyFilePath;
    this.privateKeyFilePath = privateKeyFilePath;
  }
  
  public RSAPrivateKey getPrivatekeyContent() throws Exception {
    if (this.privateKeyFilePath == null || this.privateKeyFilePath.isEmpty())
      throw new Exception("Privatekey content path found to be null."); 
    String privateKeyContent = new String(Files.readAllBytes(Paths.get(this.privateKeyFilePath, new String[0])));
    return getPrivatekeyContent(privateKeyContent);
  }
  
  public RSAPublicKey getPublicKeyContent() throws Exception {
    if (this.publicKeyFilePath == null || this.publicKeyFilePath.isEmpty())
      throw new Exception("Publickey content path found to be null."); 
    String publicKeyContent = new String(Files.readAllBytes(Paths.get(this.publicKeyFilePath, new String[0])));
    return getPublicKeyContent(publicKeyContent);
  }
  
  public RSAPrivateKey getPrivatekeyContent(String privateKeyContent) throws Exception {
    if (privateKeyContent == null || privateKeyContent.isEmpty())
      throw new Exception("Private key content found to be null."); 
    privateKeyContent = privateKeyContent.replaceAll("\\n", "").replace("-----BEGIN RSA PRIVATE KEY-----", "").replace("-----END RSA PRIVATE KEY-----", "");
    KeyFactory kf = KeyFactory.getInstance("RSA");
    PKCS8EncodedKeySpec keySpecPKCS8 = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeyContent));
    return (RSAPrivateKey)kf.generatePrivate(keySpecPKCS8);
  }
  
  public RSAPublicKey getPublicKeyContent(String publicKeyContent) throws Exception {
    if (publicKeyContent == null || publicKeyContent.isEmpty())
      throw new Exception("Public key content found to be null."); 
    publicKeyContent = publicKeyContent.replaceAll("\\n", "").replace("-----BEGIN RSA PUBLIC KEY-----", "").replace("-----END RSA PUBLIC KEY-----", "");
    KeyFactory kf = KeyFactory.getInstance("RSA");
    X509EncodedKeySpec keySpecX509 = new X509EncodedKeySpec(Base64.getDecoder().decode(publicKeyContent));
    return (RSAPublicKey)kf.generatePublic(keySpecX509);
  }
}