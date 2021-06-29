package com.subex.onboarding.service;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.google.gson.Gson;
import com.subex.onboarding.entity.DefinitionEntity;
import com.subex.onboarding.entity.FieldGroupEntity;
import com.subex.onboarding.entity.ProfileFieldGroupEntity;
import com.subex.onboarding.entity.ValidationEntity;
import com.subex.onboarding.entity.WeightageEntity;
import com.subex.onboarding.model.Definition;
import com.subex.onboarding.model.FieldGroupModel;
import com.subex.onboarding.model.FormFieldGroup;
import com.subex.onboarding.model.ProfileInfo;
import com.subex.onboarding.model.Response;
import com.subex.onboarding.model.Validation;
import com.subex.onboarding.model.Weightage;
import com.subex.onboarding.repository.DefinitionRepository;
import com.subex.onboarding.repository.FieldGroupRepository;
import com.subex.onboarding.repository.ProfileFieldGroupRepository;
import com.subex.onboarding.repository.ValidationRepository;
import com.subex.onboarding.repository.WeighatgeEntityRepository;


@ExtendWith(SpringExtension.class)
@SpringBootTest 
public class ProfileInfoServiceTest {
	
	   @Autowired
	   private ProfileInfoService profileInfoService;
	  
	    @MockBean
	    DefinitionRepository definitionRepositoryMock;
	    
	    @MockBean
	    FieldGroupRepository fieldGroupRepositoryMock;

	    @MockBean
	    ProfileFieldGroupRepository profileFieldGroupRepositoryMock;

	    @MockBean
	    WeighatgeEntityRepository weighatgeEntityRepositoryMock;
	    
	    @MockBean
	    ValidationRepository validationRepositoryMock;

	    
	
	public ProfileFieldGroupEntity setProfileFieldEnities(String profileNmae) {
		
		FieldGroupEntity fieldGroupEntity=new FieldGroupEntity();
		fieldGroupEntity.setFieldGrpId((long) 1);
		fieldGroupEntity.setFieldGrpName("Basic Details"); 
		ProfileFieldGroupEntity profileFieldGroupEntity= new ProfileFieldGroupEntity();
		profileFieldGroupEntity.setProfileName(profileNmae);
		profileFieldGroupEntity.setId((long) 1);
		profileFieldGroupEntity.setFieldGroupEntity(fieldGroupEntity);
		
		return profileFieldGroupEntity;
		
		
	}
	  
public List<ValidationEntity> setValidationEnities() {
		
	ValidationEntity validationEntity =new ValidationEntity();
	validationEntity.setValId(1);
	validationEntity.setValidationName("max");
	validationEntity.setValidationMsg("maximum number");		
	List<ValidationEntity> validationsenties = new ArrayList();
	validationsenties.add(validationEntity);
	return validationsenties;		
	}
	
public List<WeightageEntity> setWeightageEnities() {
	WeightageEntity weightageEntity = new WeightageEntity();
	weightageEntity.setId((long) 1);
	weightageEntity.setType("banglore");
	weightageEntity.setWeightageVal(6.7);	
	List<WeightageEntity> weightageEntities = new ArrayList();
	weightageEntities.add(weightageEntity);
	return weightageEntities;		
	}
public DefinitionEntity setDefinitionEntity() {
	DefinitionEntity definitionEntity= new DefinitionEntity();
	definitionEntity.setDfnId((long) 1);
	definitionEntity.setDfnName("Fname");
	definitionEntity.setProfileName("SMS");
	definitionEntity.setValidations(setValidationEnities());
	definitionEntity.setWeightages(setWeightageEnities());
	return definitionEntity;		
	}
	

public ProfileInfo setProfileInfo() {
	Weightage weightage = new Weightage();
	weightage.setType("banglore");
	weightage.setWeightageVal(6.7);
	Validation validation =new Validation();
	validation.setValidationName("max");
	validation.setValidationMsg("maximum number");
	List<Weightage> weightages = new ArrayList();	
	weightages.add(weightage);
	List<Validation> validations = new ArrayList();
	validations.add(validation);
		
	FieldGroupModel fieldGroupModel =new FieldGroupModel();
	fieldGroupModel.setFieldGrpName("Basic Details");
	fieldGroupModel.setFieldGrpId(1);
	
	Definition definition=new Definition();
	definition.setProfileName("SMS");
	definition.setDfnName("Fname");
	definition.setWeightages(weightages);
	definition.setValidations(validations);		
	List<Definition> definitions = new ArrayList();
    definitions.add(definition);
	
	FormFieldGroup formFieldGroup =new FormFieldGroup();
	List<FormFieldGroup> formFieldGrouplist =new ArrayList();
	formFieldGroup.setFieldGroup(fieldGroupModel);
	formFieldGroup.setGroupOrder(1);
	formFieldGroup.setDefinitions(definitions);		
	formFieldGrouplist.add(formFieldGroup);
	
	ProfileInfo profileInfo= new ProfileInfo();
	profileInfo.setProfileName("SMS");
	profileInfo.setProfileData(formFieldGrouplist);
	return profileInfo;		
	}


	@Test
	public void createProfileInfoTest() {
	ProfileFieldGroupEntity profileFieldGroupEntity= setProfileFieldEnities("SMS");	
		List<WeightageEntity> weightageEntities =setWeightageEnities();
		List<ValidationEntity> validationsenties =setValidationEnities();					
	DefinitionEntity definitionEntity =setDefinitionEntity();
		Gson gson = new Gson();
		//ProfileInfo profileInfo = gson.fromJson( ProfileInputData.profileInfo, ProfileInfo.class );
	//	ProfileFieldGroupEntity profileFieldGroupEntity = gson.fromJson( ProfileInputData.profileInfoEntity, ProfileFieldGroupEntity.class );
		when(profileFieldGroupRepositoryMock.save(profileFieldGroupEntity)).thenReturn(profileFieldGroupEntity);
		when(definitionRepositoryMock.save(definitionEntity)).thenReturn(definitionEntity);
		when(weighatgeEntityRepositoryMock.saveAll(weightageEntities)).thenReturn(weightageEntities);
		when(validationRepositoryMock.saveAll(validationsenties)).thenReturn(validationsenties);
		
	ProfileInfo profileInfo= setProfileInfo();
		
		Response response = new Response();
		response.setStatus("Success");
		response.setStatusCode(HttpStatus.CREATED+""); 
		ResponseEntity<Response> responsEntExpec =new ResponseEntity<>(response, HttpStatus.CREATED);

	   ResponseEntity<Response> responsEnt =profileInfoService.createProfileInfo(profileInfo);
	   assertEquals(responsEntExpec, responsEnt);
	  
	  }
	 
	@Test
	public void getprofileinfosTest() {							
		DefinitionEntity definitionEntity =setDefinitionEntity();	
		definitionEntity.setProfileFieldGroupEntity(setProfileFieldEnities("SMS"));
		List<DefinitionEntity> definitionEntities = new ArrayList();
		definitionEntities.add(definitionEntity);		
	    when(definitionRepositoryMock.findAllDfnsForProfile( "SMS" )).thenReturn(definitionEntities);	   	   
	    ProfileInfo profileInfo= setProfileInfo(); 
		List<ProfileInfo> profileInfos = new ArrayList();
		profileInfos.add(profileInfo);		
	    ResponseEntity<List<ProfileInfo>> responsEntExpec =profileInfoService.getprofileinfos("SMS");
	    for (ProfileInfo p :responsEntExpec.getBody())
	    {
	    assertEquals(profileInfo.getProfileName(),p.getProfileName() );
	    }
		
	}

	@Test
	public void updateprofileInfosTest() {							
		DefinitionEntity definitionEntity =setDefinitionEntity();				
		List<DefinitionEntity> definitionEntities = new ArrayList();
		definitionEntities.add(definitionEntity);
		ValidationEntity validationEntity =new ValidationEntity();
		validationEntity.setValId(1);
		validationEntity.setValidationName("max");
		validationEntity.setValidationMsg("maximum number");
		WeightageEntity weightageEntity = new WeightageEntity();
		weightageEntity.setId((long) 1);
		weightageEntity.setType("banglore");
		weightageEntity.setWeightageVal(6.7);	
		
		List<WeightageEntity> weightageEntities =setWeightageEnities();
		List<ValidationEntity> validationsenties =setValidationEnities();
		FieldGroupEntity fieldGroupEntity =new FieldGroupEntity();
		fieldGroupEntity.setFieldGrpId((long) 1);
		fieldGroupEntity.setFieldGrpName("Basic Details");
	    List<FieldGroupEntity> fieldGroupEntityList =new ArrayList();
	    fieldGroupEntityList.add(fieldGroupEntity);
	  
	   when(definitionRepositoryMock.findAllDfnsForProfile("SMS")).thenReturn(definitionEntities);
	   when(fieldGroupRepositoryMock.findAllFldGrpForProfile("SMS" )).thenReturn(fieldGroupEntityList);
	   when(weighatgeEntityRepositoryMock.findAllWgtForProfile( "SMS" )).thenReturn(weightageEntities);
	   when(validationRepositoryMock.findAllValdForProfile("SMS")).thenReturn(validationsenties);
	   
//	   ProfileFieldGroupEntity profileFieldGroupEntity= setProfileFieldEnities("SMS");
//	   Optional<ProfileFieldGroupEntity> profileFieldGroupEntityOpt = Optional.of(profileFieldGroupEntity);
	   ProfileFieldGroupEntity profileFieldGroupEntity= new ProfileFieldGroupEntity();
		profileFieldGroupEntity.setProfileName("SMS");
		profileFieldGroupEntity.setId((long) 1);
		profileFieldGroupEntity.setFieldGroupEntity(fieldGroupEntity);
		Optional<ProfileFieldGroupEntity> profileFieldGroupEntityOpt = Optional.of(profileFieldGroupEntity);
	   when(fieldGroupRepositoryMock.getOne((long) 1)).thenReturn(fieldGroupEntity);
	   when(profileFieldGroupRepositoryMock.getProfileFieldGroupForProfile( (long) 1 ,"SMS")).thenReturn(profileFieldGroupEntityOpt);
	   when(profileFieldGroupRepositoryMock.save(profileFieldGroupEntity)).thenReturn(profileFieldGroupEntity);
	   
	   when(definitionRepositoryMock.getOne((long) 1)).thenReturn(definitionEntity);
	   when(weighatgeEntityRepositoryMock.getOne((long) 1)).thenReturn(weightageEntity);
	   when(validationRepositoryMock.getOne((long) 1)).thenReturn(validationEntity);
	   when(definitionRepositoryMock.save(definitionEntity)).thenReturn(definitionEntity);
	   when(weighatgeEntityRepositoryMock.saveAll( weightageEntities )).thenReturn(weightageEntities);
	   when(validationRepositoryMock.saveAll( validationsenties )).thenReturn(validationsenties);
	   
	   when(weighatgeEntityRepositoryMock.saveAll( weightageEntities )).thenReturn(weightageEntities);
	   validationRepositoryMock.delete( validationEntity);
	   weighatgeEntityRepositoryMock.delete( weightageEntity);
	   when(profileFieldGroupRepositoryMock.save(profileFieldGroupEntity)).thenReturn(profileFieldGroupEntity);
	   weighatgeEntityRepositoryMock.deleteAll( weightageEntities);
	   validationRepositoryMock.deleteAll( validationsenties); 
	   definitionRepositoryMock.delete(definitionEntity);
	 
	   ProfileInfo profileInfo= setProfileInfo(); 
		
		Response response = new Response();
        response.setStatus("Success");
        response.setStatusCode(HttpStatus.ACCEPTED+"");
        ResponseEntity<Response> responsEntExpec= new ResponseEntity<>(response, HttpStatus.ACCEPTED);
		
	    ResponseEntity<Response> responsEnt =profileInfoService.updateProfileInfo(profileInfo);
	    assertEquals(responsEntExpec, responsEnt);
		
	}
}
