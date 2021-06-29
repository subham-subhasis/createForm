package com.subex.onboarding.utility;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

public interface IKeyContentFetcher {
	RSAPrivateKey getPrivatekeyContent() throws Exception;
	  
	RSAPublicKey getPublicKeyContent() throws Exception;
	  
	RSAPrivateKey getPrivatekeyContent(String paramString) throws Exception;
	  
	RSAPublicKey getPublicKeyContent(String paramString) throws Exception;

}
