package com.subex.onboarding.utility;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.subex.onboarding.entity.DefinitionEntity;
import com.subex.onboarding.entity.InfoDataEntity;
import com.subex.onboarding.entity.PartnerInfoEntity;
import com.subex.onboarding.helper.EmailModel;
import com.subex.onboarding.helper.PanelData;
import com.subex.onboarding.helper.ScoreData;
import com.subex.onboarding.helper.UserInfoMapper;
import com.subex.onboarding.model.EmailData;
import com.subex.onboarding.model.InfoData;

@Component
public class PartnerInfoUtility {

	private String emailSubject;
	private String emailServiceUrl;
	private String file;

	public PartnerInfoUtility(@Value("${emailSubject}") String emailSubject,
			@Value("${emailServiceUrl}") String emailServiceUrl, @Value("${file}") String file) {
		this.emailSubject = emailSubject;
		this.emailServiceUrl = emailServiceUrl;
		this.file = file;
	}

	public PartnerInfoEntity emailServiceValidation(String emailId, AtomicReference<String> firstName,
			AtomicReference<String> lastName) {
		PartnerInfoEntity partnerInfoEntity = new PartnerInfoEntity();
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		List<String> tolist = new ArrayList();
		tolist.add(emailId);
		EmailData emailData = new EmailData();
		emailData.setTolist(tolist);
		emailData.setSubject(emailSubject);
		String userName = emailId.substring(0, emailId.lastIndexOf('.'));
		partnerInfoEntity.setUserName(userName);
		InputStream is = null;
		try {
			is = new ClassPathResource("MailFormat.html").getInputStream();
		} catch (IOException e1) {
		}
		InputStreamReader isReader = new InputStreamReader(is);
		String emailTextBody = formEmailBody(isReader);
		String emailTextBodyFormat = emailTextBody.replace("%1%", firstName.get() + " " + lastName.get());
		String emailBase64Text = new String(Base64.getEncoder().encode(emailTextBodyFormat.getBytes()));
		emailData.setEmailBase64Text(emailBase64Text);

		HttpEntity<EmailData> entity = new HttpEntity<>(emailData, headers);
		emailData.setTolist(tolist);
		String response = "";
		try {
			response = restTemplate.postForObject(emailServiceUrl, entity, String.class);
		} catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
		}

		if (response.equalsIgnoreCase("")) {
			partnerInfoEntity.setEmailSerivice("");
			return partnerInfoEntity;
		} else if (response.equalsIgnoreCase("success")) {
			partnerInfoEntity.setEmailSerivice("Success");
			return partnerInfoEntity;
		} else {
			partnerInfoEntity.setEmailSerivice("Failed");
			return partnerInfoEntity;
		}
	}

	private String formEmailBody(InputStreamReader isReader) {
		BufferedReader reader = null;
		StringBuffer sb = new StringBuffer();
		try {
			reader = new BufferedReader(isReader);
			String fileContent = "";
			while ((fileContent = reader.readLine()) != null)
				sb.append(fileContent);
		} catch (IOException e) {

		} finally {
			try {
				if (reader != null)
					reader.close();
			} catch (IOException e) {

			}
		}
		return sb.toString();

	}

	public void sendNotificationToTeam(String emailId, EmailModel emailModel) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		List<String> tolist = new ArrayList();
		tolist.add(emailId);
		EmailData emailData = new EmailData();
		emailData.setTolist(tolist);
		emailData.setSubject(emailModel.getEmailSubject());
		emailData.setEmailText(emailModel.getEmailText());
		HttpEntity<EmailData> entity = new HttpEntity<>(emailData, headers);
		try {
			restTemplate.postForObject(emailServiceUrl, entity, String.class);
		} catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
		}

	}

	public List<UserInfoMapper> getUserDetailsAPIcall(String filter, String userDetailsServiceUrl) {
		RestTemplate restTemplate = new RestTemplate();
		List<UserInfoMapper> users = null;
		try {
			ResponseEntity<UserInfoMapper[]> result = restTemplate.getForEntity(userDetailsServiceUrl + filter,
					UserInfoMapper[].class);
			users = Arrays.asList(result.getBody());
			// userInfo=users.get(0);
		} catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
		}
		return users;
	}

	public PanelData getPanelDataAPIcall(String name, String panelDataSerive) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		PanelData requestBody = new PanelData();
		requestBody.setName(name);
		HttpEntity<PanelData> requestBodyPar = new HttpEntity<>(requestBody, headers);
		PanelData panelData = null;
		try {
			panelData = restTemplate.postForObject(panelDataSerive, requestBodyPar, PanelData.class);
		} catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
		}

		return panelData;
	}

	public void partnerScoringAPIcall(Integer partnerId, String profileName, String scoreApiURL) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		ScoreData scoreData = new ScoreData();
		scoreData.setPartnerId(partnerId);
		scoreData.setProfileName(profileName);
		HttpEntity<ScoreData> scoreDataPar = new HttpEntity<>(scoreData, headers);
		try {
			restTemplate.postForObject(scoreApiURL, scoreDataPar, String.class);
		} catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
		}

	}

	public InfoDataEntity setPartnerDefinitions(InfoData w, Map<Long, DefinitionEntity> defMap) {
		InfoDataEntity ide = new InfoDataEntity();
		if (file.equalsIgnoreCase(defMap.get(w.getDfnId().longValue()).getFieldType())) {
			if (w.getDfnVal() != null && w.getDfnVal().contains(",")) {
				String fileType = w.getDfnVal().substring(0, w.getDfnVal().indexOf(','));
				ide.setDfnBlobType(fileType);
				String fileVal = w.getDfnVal().substring(w.getDfnVal().indexOf(',') + 1);
				byte[] decodedByte = Base64.getDecoder().decode(fileVal);
				ide.setDfnBlobVal(decodedByte);
			}
		} else {
			ide.setDfnVal(w.getDfnVal());
		}
		ide.setDefinitionEntity(defMap.get(w.getDfnId().longValue()));

		return ide;
	}

}
