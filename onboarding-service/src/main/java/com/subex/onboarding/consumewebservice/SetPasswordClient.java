
package com.subex.onboarding.consumewebservice;

import javax.xml.bind.JAXBElement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import com.subex.wsdl.SetPassword;
import com.subex.wsdl.SetPasswordResponse;

public class SetPasswordClient extends WebServiceGatewaySupport {

	private static final Logger log = LoggerFactory.getLogger(SetPasswordClient.class);
	@Value("${ROCSOAPURLUserManagement}")
	private String ROCSOAPURLUserManagement;
	
	public SetPasswordResponse setPasswordSave(JAXBElement<String>
	jaxbElementUserName, JAXBElement<String> jaxbElementPassword) {
		String url = ROCSOAPURLUserManagement+"setPassword";
		SetPassword request =  new SetPassword();
		request.setUsrName(jaxbElementUserName);
		request.setPassword(jaxbElementPassword);
		log.info("value for soap request set password : " + request);
		SetPasswordResponse response = (SetPasswordResponse) getWebServiceTemplate().marshalSendAndReceive(
				url , request,
				new SoapActionCallback("http://service.server.app.web.spark.subex.com/setPasswordSave"));	
		return response;
	}
}