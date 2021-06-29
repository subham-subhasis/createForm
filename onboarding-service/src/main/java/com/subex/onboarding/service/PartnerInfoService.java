package com.subex.onboarding.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.xml.bind.JAXBElement;

import org.dozer.DozerBeanMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.subex.onboarding.api.PartnerinfosApiDelegate;
import com.subex.onboarding.consumewebservice.SetPasswordClient;
import com.subex.onboarding.entity.DefinitionEntity;
import com.subex.onboarding.entity.InfoDataEntity;
import com.subex.onboarding.entity.PartnerInfoEntity;
import com.subex.onboarding.exception.PartnerAlreadyExistException;
import com.subex.onboarding.exception.UserNotExistException;
import com.subex.onboarding.helper.EmailModel;
import com.subex.onboarding.helper.PanelData;
import com.subex.onboarding.helper.UserInfoMapper;
import com.subex.onboarding.model.InfoData;
import com.subex.onboarding.model.PartnerInfo;
import com.subex.onboarding.model.PasswordModel;
import com.subex.onboarding.model.Response;
import com.subex.onboarding.repository.DefinitionRepository;
import com.subex.onboarding.repository.InfoDataEntityRepository;
import com.subex.onboarding.repository.PartnerInfoEntityRepository;
import com.subex.onboarding.utility.PartnerInfoUtility;
import com.subex.wsdl.ObjectFactory;
import com.subex.wsdl.SetPasswordResponse;

@Service
public class PartnerInfoService implements PartnerinfosApiDelegate {
	private static final Logger log = LoggerFactory.getLogger(SetPasswordClient.class);

	@Autowired
	PartnerInfoEntityRepository partnerInfoEntityRepository;

	@Autowired
	InfoDataEntityRepository infoDataEntityRepository;

	@Autowired
	DefinitionRepository definitionRepository;

	@Autowired
	PartnerInfoUtility partnerInfoUtility;

	@Autowired
	SetPasswordClient setPasswordClient;
	DozerBeanMapper mapper = new DozerBeanMapper();

	@Value("${emailToRegisterAndTeam}")
	private Boolean emailToRegisterAndTeam;
	
	@Value("${emailToRegisterPartner}")
	private Boolean emailToRegisteredPartner;

	@Value("${emailToBusinessOwnersReq}")
	private Boolean emailToBusinessOwnersReq;

	@Value("${firstName}")
	private String partnerFirstName;

	@Value("${lastName}")
	private String partnerLastName;

	@Value("${email}")
	private String email;

	@Value("${file}")
	private String file;

	@Value("${definition.duplicateCheck.keys}")
	private List<String> defNames;

	@Value("${teamsToNotify}")
	private List<String> teamsToNotify;

	@Value("${userDetailsByTeamUrl}")
	private String userDetailsByTeamUrl;

	@Value("${userDetailsByBusinessTypeUrl}")
	private String userDetailsByBusinessTypeUrl;

	@Value("${emailSubjectToTeam}")
	private String emailSubjectToTeam;

	@Value("${emailTextToTeam}")
	private String emailTextToTeam;

	@Value("${companyName}")
	private String companyName;

	@Value("${enablePanelData}")
	private Boolean enablePanelData;

	@Value("${panelDataServiceUrl}")
	private String panelDataServiceUrl;

	@Value("${partnerscoringRequired}")
	private Boolean partnerscoringRequired;

	@Value("${scoreApiURL}")
	private String scoreApiURL;

	@Override
	@Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
	public ResponseEntity<Response> createpartnerInfoEntity(PartnerInfo partnerInfo) {
		PartnerInfoEntity partnerInfoEntity = mapper.map(partnerInfo, PartnerInfoEntity.class);
		partnerInfoEntity.setCreatedDate(new Date());
		partnerInfoEntity.setStatus("preactive");
		List<InfoDataEntity> infoDataEntries = new ArrayList<>();
		List<DefinitionEntity> defList = definitionRepository.findAll();
		Map<Long, DefinitionEntity> defMap = defList.stream()
				.collect(Collectors.toMap(DefinitionEntity::getDfnId, Function.identity()));
		Map<String, String> defNameMap = new HashMap<>();
		AtomicReference<String> firstName = new AtomicReference<>();
		AtomicReference<String> lastName = new AtomicReference<>();
		for (InfoData w : partnerInfo.getInfoData()) {
			defNameMap.put(w.getDfnName(), w.getDfnVal());
			InfoDataEntity ide = partnerInfoUtility.setPartnerDefinitions(w, defMap);
			ide.setPartnerInfoEntity(partnerInfoEntity);
			infoDataEntries.add(ide);
		}
		List<String> defNameList = new ArrayList<>();
		for (String defName : defNames) {
			Optional<PartnerInfoEntity> partnerInfoEntOpt = partnerInfoEntityRepository
					.findByDfnName(defNameMap.get(defName), defName);
			if (partnerInfoEntOpt.isPresent())
				defNameList.add(defName);
		}
		if (!defNameList.isEmpty()) {
			String delim = ",";
			String duplicateFields = String.join(delim, defNameList);
			throw new PartnerAlreadyExistException("Partner with same " + duplicateFields + " already exist!!");
		}

		if (enablePanelData) {
			String company = defNameMap.get(companyName);
			PanelData panelData = partnerInfoUtility.getPanelDataAPIcall(company, panelDataServiceUrl);
			if (panelData != null)
				partnerInfoEntity.setPanelDataExists(panelData.getResult());
		}
		Response response = new Response();
		response.setStatus("success");

		String company = defNameMap.get(companyName);
		firstName.set(defNameMap.get(partnerFirstName));
		lastName.set(defNameMap.get(partnerLastName));
		
		if( emailToRegisteredPartner )
		{
			String emailId = defNameMap.get(email);
			PartnerInfoEntity partnerInfoEmailObj = partnerInfoUtility.emailServiceValidation(emailId, firstName,
					lastName);
			partnerInfoEntity.setUserName(partnerInfoEmailObj.getUserName());
			partnerInfoEntity.setEmailSerivice(partnerInfoEmailObj.getEmailSerivice());
			if ("".equalsIgnoreCase(partnerInfoEntity.getEmailSerivice()))
				response.setStatus("EmailServiceDown");
			else if (partnerInfoEntity.getEmailSerivice() != null
					&& ("failed".equalsIgnoreCase(partnerInfoEntity.getEmailSerivice())))
				response.setStatus("InvalidMailId");
		}
		
		if (emailToRegisterAndTeam) {
			
			EmailModel emailModel = new EmailModel();
			for (String teamName : teamsToNotify) {
				List<UserInfoMapper> userInfos = partnerInfoUtility.getUserDetailsAPIcall(teamName,
						userDetailsByTeamUrl);
				UserInfoMapper userInfo = userInfos.get(0);
				if (userInfo != null) {
					emailModel.setFirstName(userInfo.getUserForename());
					emailModel.setLastName(userInfo.getUserSurname());
					emailModel.setEmailSubject(emailSubjectToTeam);
					String emailTextBody = String.format(emailTextToTeam,
							emailModel.getFirstName() + " " + emailModel.getLastName(),
							firstName.get() + " " + lastName.get(), company, partnerInfo.getProfileName());
					emailModel.setEmailText(emailTextBody);
					partnerInfoUtility.sendNotificationToTeam(userInfo.getUserEmail(), emailModel);
				}
			}
		}
		if (emailToBusinessOwnersReq) {
			
			
			List<UserInfoMapper> userInfos = partnerInfoUtility.getUserDetailsAPIcall(partnerInfo.getProfileName(),
					userDetailsByBusinessTypeUrl);
			EmailModel emailModel = new EmailModel();
			if (userInfos != null && !userInfos.isEmpty()) {
				Set<String> emailSet = new HashSet<>();
				for (UserInfoMapper userInfo : userInfos) {
					emailModel.setFirstName(userInfo.getUserForename());
					emailModel.setLastName(userInfo.getUserSurname());
					emailModel.setEmailSubject(emailSubjectToTeam);
					String emailTextBody = String.format(emailTextToTeam,
							emailModel.getFirstName() + " " + emailModel.getLastName(),
							firstName.get() + " " + lastName.get(), company, partnerInfo.getProfileName());
					emailModel.setEmailText(emailTextBody);
					if (emailSet.add(userInfo.getUserEmail()) && !userInfo.getIsExternal())
						partnerInfoUtility.sendNotificationToTeam(userInfo.getUserEmail(), emailModel);
				}
			}
		}

		PartnerInfoEntity prtEntResp = partnerInfoEntityRepository.save(partnerInfoEntity);
		infoDataEntityRepository.saveAll(infoDataEntries);
		if (partnerscoringRequired) {
			Integer partnerId = (int) prtEntResp.getPartnerId();
			partnerInfoUtility.partnerScoringAPIcall(partnerId, partnerInfo.getProfileName(), scoreApiURL);
		}
		response.setStatusCode(HttpStatus.CREATED + "");
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@Override
	@Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
	public ResponseEntity<Response> savePassword(PasswordModel passwordModel) {
		Response response = new Response();
		Optional<PartnerInfoEntity> partnerInfoEntopt = partnerInfoEntityRepository
				.findByUserName(passwordModel.getUserName());
		if (partnerInfoEntopt.isPresent()) {
			PartnerInfoEntity partnerInfoEnt = partnerInfoEntopt.get();
			if (partnerInfoEnt.isPasswordStatus()) {
				throw new UserNotExistException("User already exist.");
			} else {
				String decrPassword = new String(Base64.getDecoder().decode(passwordModel.getPassword()));
				ObjectFactory objectFactory = new ObjectFactory();
				JAXBElement<String> jaxbElementUserName = objectFactory
						.createSetPasswordUsrName(passwordModel.getUserName());
				JAXBElement<String> jaxbElementPassword = objectFactory.createSetPasswordPassword(decrPassword);
				SetPasswordResponse setPasswordResponse = setPasswordClient.setPasswordSave(jaxbElementUserName,
						jaxbElementPassword);
				JAXBElement<String> return1 = setPasswordResponse.getReturn();
				String valueResponseStr = return1.getValue();
				log.info("value fetched : " + valueResponseStr);
				if (!"success".equalsIgnoreCase(valueResponseStr)) {
					throw new UserNotExistException(valueResponseStr);
				}
				partnerInfoEnt.setPasswordStatus(true);
				partnerInfoEntityRepository.save(partnerInfoEnt);
				response.setStatus("success");
				response.setStatusCode(HttpStatus.ACCEPTED + "");
			}
		} else {
			throw new UserNotExistException("User does not exist.");
		}
		return new ResponseEntity<>(response, HttpStatus.ACCEPTED);

	}

}
