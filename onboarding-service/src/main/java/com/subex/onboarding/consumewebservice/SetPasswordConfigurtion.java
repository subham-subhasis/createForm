
package com.subex.onboarding.consumewebservice;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

@Configuration
public class SetPasswordConfigurtion {
	
	@Value("${ROCSOAPURLUserManagement}")
	private String ROCSOAPURLUserManagement;

	@Bean
    public Jaxb2Marshaller marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        // this package must match the package in the <generatePackage> specified in
        // pom.xml
        marshaller.setContextPath("com.subex.wsdl");
        return marshaller;
    }
	@Bean
	public SetPasswordClient setPasswordClient(Jaxb2Marshaller marshaller) {
		SetPasswordClient client = new SetPasswordClient();
		client.setDefaultUri(ROCSOAPURLUserManagement);
		client.setMarshaller(marshaller);
		client.setUnmarshaller(marshaller);
		return client;
	}

}
