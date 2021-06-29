package com.subex.onboarding.service;

import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.subex.ngp.audit.trail.lib.AuditEventModel;
import com.subex.onboarding.api.ProfileinfosApiDelegate;
import com.subex.onboarding.entity.*;
import com.subex.onboarding.model.*;
import com.subex.onboarding.repository.DefinitionRepository;
import com.subex.onboarding.repository.FieldGroupRepository;
import com.subex.onboarding.repository.ProfileFieldGroupRepository;
import com.subex.onboarding.repository.ValidationRepository;
import com.subex.onboarding.repository.WeighatgeEntityRepository;
import com.subex.onboarding.utility.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProfileInfoService implements ProfileinfosApiDelegate
{
    DozerBeanMapper mapper = new DozerBeanMapper();
    
    @Autowired
    DefinitionRepository definitionRepository;
    
    @Autowired
    FieldGroupRepository fieldGroupRepository;

    @Autowired
    ProfileFieldGroupRepository profileFieldGroupRepository;

    @Autowired
    WeighatgeEntityRepository weighatgeEntityRepository;
    
    @Autowired
    ValidationRepository validationRepository;
    
    @Autowired
    ProfileInfoUtility profileUtility;

    String status="Success";
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ResponseEntity<Response> createProfileInfo(ProfileInfo profileInfo) {

        profileInfo.getProfileData().forEach( formFieldGroup -> {
        	ProfileFieldGroupEntity profileFieldGroupEntityPar =new ProfileFieldGroupEntity();     	
            ProfileFieldGroupEntity profileFieldGroupEntity = profileUtility.setProfileFieldGroupEntityProperties(profileInfo,formFieldGroup,profileFieldGroupEntityPar);
            profileFieldGroupRepository.save( profileFieldGroupEntity );
            formFieldGroup.getDefinitions().forEach( dfn->{
                     
                DefinitionEntity definitionEntity = profileUtility.setDefinitionEntityProperties(dfn,profileFieldGroupEntity);                            
                List<WeightageEntity> weightageEntities = profileUtility.setWeightageEntityProperties(dfn,definitionEntity);
                definitionEntity.setWeightages(weightageEntities);  
                List<ValidationEntity> validationEntities = profileUtility.setValidationEntityProperties(dfn,definitionEntity);             
                definitionEntity.setValidations(validationEntities);          
                definitionRepository.save( definitionEntity );
                if ( !weightageEntities.isEmpty() )
                    weighatgeEntityRepository.saveAll( weightageEntities );
                if ( !validationEntities.isEmpty() )
                	validationRepository.saveAll( validationEntities );
            	});
        });

        Response response = new Response();
        response.setStatus(status);
        response.setStatusCode(HttpStatus.CREATED+"");
        AuditEventModel.callAuditLog("PROFILE-FIELD-GROUP-ENTITY", "Create profile info", "Profile created successfully with profile name: "+profileInfo.getProfileName(), "success");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    
	@Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ResponseEntity<Response> updateProfileInfo(ProfileInfo profileInfo) {

        List<DefinitionEntity> definitionList =  definitionRepository.findAllDfnsForProfile( profileInfo.getProfileName() );
        Map<Long, DefinitionEntity> defMap = definitionList.stream()
                .collect(Collectors.toMap(DefinitionEntity::getDfnId, Function.identity()));
       
        List<FieldGroupEntity> fieldGroupEntityList =  fieldGroupRepository.findAllFldGrpForProfile( profileInfo.getProfileName() );
        Map<Long, FieldGroupEntity> fldGrpMap = fieldGroupEntityList.stream()
        		.collect(Collectors.toMap(FieldGroupEntity::getFieldGrpId, Function.identity()));
        
        List<WeightageEntity> weightageEntityList =  weighatgeEntityRepository.findAllWgtForProfile( profileInfo.getProfileName() );
        Map<Long, WeightageEntity>weightageMap = weightageEntityList.stream()
        		.collect(Collectors.toMap(WeightageEntity::getId, Function.identity()));
       
        List<ValidationEntity> validationEntityList =  validationRepository.findAllValdForProfile( profileInfo.getProfileName() );
        Map<Long, ValidationEntity> validationMap = validationEntityList.stream()
        		.collect(Collectors.toMap(ValidationEntity::getValId, Function.identity()));
     
        profileInfo.getProfileData().forEach( formFieldGroup -> {      	     	
        	ProfileFieldGroupEntity profileFieldGroupEntity =updateProfileFieldGroupEntity(formFieldGroup,fldGrpMap,profileInfo.getProfileName());
        	profileFieldGroupRepository.save( profileFieldGroupEntity );    	            
            for(Definition dfn :formFieldGroup.getDefinitions() ){               	
            	DefinitionEntity definitionEntity = updateDefinitionEntityProperties(dfn,profileFieldGroupEntity,defMap);          	
            	List<WeightageEntity> weightageEntities = updateWeightageEntities(dfn,definitionEntity,weightageMap);                     
                definitionEntity.setWeightages(weightageEntities);                      
                List<ValidationEntity> validationEntities = updateValidationEntities(dfn,definitionEntity,validationMap);             
                definitionEntity.setValidations(validationEntities);
                definitionRepository.save(definitionEntity);
                if ( !weightageEntities.isEmpty() )
                    weighatgeEntityRepository.saveAll( weightageEntities );                
                if ( !validationEntities.isEmpty() )
                	validationRepository.saveAll( validationEntities );
             } 
        } );
        
        for( ValidationEntity validationEntity : validationMap.values() )
        {
        	validationRepository.delete( validationEntity );
        }       
        for( WeightageEntity weightageEntity : weightageMap.values() )
        {
        	weighatgeEntityRepository.delete( weightageEntity );
        }             
        for( FieldGroupEntity fieldGroupEntity : fldGrpMap.values() )
        {
        	Optional<ProfileFieldGroupEntity> profileFieldGroupEntityOpt = profileFieldGroupRepository.getProfileFieldGroupForProfile( fieldGroupEntity.getFieldGrpId() , profileInfo.getProfileName() );
        	if(profileFieldGroupEntityOpt.isPresent()) {
        	ProfileFieldGroupEntity profileFieldGroupEntityPar = profileFieldGroupEntityOpt.get();
        	profileFieldGroupEntityPar.setFieldGrpDeleteFl(true);
        	profileFieldGroupRepository.save(profileFieldGroupEntityPar);
        	}
        }       
        for( DefinitionEntity definitionEntity : defMap.values() )
        {
            weighatgeEntityRepository.deleteAll( definitionEntity.getWeightages());
            validationRepository.deleteAll(definitionEntity.getValidations());
            definitionRepository.delete( definitionEntity );
        }
        Response response = new Response();
        response.setStatus(status);
        response.setStatusCode(HttpStatus.ACCEPTED+"");
        AuditEventModel.callAuditLog("PROFILE-FIELD-GROUP-ENTITY", "Update portfolio info", "Portfolio updated successfully for ."+ profileInfo.getProfileName(), "success");
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }


	@Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ResponseEntity<List<ProfileInfo>> getprofileinfos(String profileName) {
        List<DefinitionEntity>  definitionEntities = null;
        definitionEntities = definitionRepository.findAllDfnsForProfile( profileName );
        
        Map<String, Map<ProfileFieldGroupEntity,List<Definition>>> configMap = profileUtility.getDefinitionEntities(definitionEntities);     
        List<ProfileInfo> profileInfos =profileUtility.setProfileInfosData(configMap);
        AuditEventModel.callAuditLog("PROFILE-FIELD-GROUP-ENTITY", "Fetch profiles", "Get all profile details.", "success");
        return  new ResponseEntity<>( profileInfos , HttpStatus.OK );
    }

	
	
	public DefinitionEntity updateDefinitionEntityProperties(Definition dfn,ProfileFieldGroupEntity profileFieldGroupEntity,Map<Long, DefinitionEntity> defMap) {
		DefinitionEntity definitionEntity=null;           	
        if (dfn.getDfnId() == null) {
            definitionEntity = mapper.map(dfn, DefinitionEntity.class);                   
        }
       else
        {
    	    definitionEntity = definitionRepository.getOne(dfn.getDfnId().longValue());
            defMap.remove( dfn.getDfnId().longValue() );
        }  
        definitionEntity = mapper.map( dfn , DefinitionEntity.class);   
        definitionEntity.setProfileFieldGroupEntity(profileFieldGroupEntity);
        definitionEntity.setProfileName(profileFieldGroupEntity.getProfileName());
        
        return definitionEntity;		
	}
	
	public List<WeightageEntity> updateWeightageEntities(Definition dfn,DefinitionEntity definitionEntity,Map<Long, WeightageEntity> weightageMap){	
		List<WeightageEntity> weightageEntities = new ArrayList<>();
        if (dfn.getWeightages() != null && !dfn.getWeightages().isEmpty()){
            for (Weightage w : dfn.getWeightages()) {
                WeightageEntity weightageEntity = null;                             
                if( w.getId() == null )
                {
                	weightageEntity = new WeightageEntity();
                }
                else 
                {
                	weightageEntity = weighatgeEntityRepository.getOne( w.getId().longValue() );
                	weightageMap.remove( w.getId().longValue() );
                }
                weightageEntity.setDefinitionEntity(definitionEntity);
                weightageEntity.setType(w.getType());
                weightageEntity.setWeightageVal(w.getWeightageVal());
                weightageEntities.add(weightageEntity);
                }
            }       		
		return weightageEntities;
	}
	
	
	public List<ValidationEntity> updateValidationEntities(Definition dfn,DefinitionEntity definitionEntity,Map<Long, ValidationEntity> validationMap){	
		 List<ValidationEntity> validationEntities = new ArrayList<>();
	        if (dfn.getValidations() != null && !dfn.getValidations().isEmpty()) {
	            for (Validation w : dfn.getValidations()) {
	            	ValidationEntity validationEntity = null;    	                	
	                if( w.getValId() == null )
	                {
	                	validationEntity = new ValidationEntity();
	                }
	                else 
	                {
	                   validationEntity = validationRepository.getOne(w.getValId().longValue());
	                   validationMap.remove( w.getValId().longValue() );
	                }
	                validationEntity.setDefinitionEntity(definitionEntity);
	                validationEntity.setValidationMsg(w.getValidationMsg());
	                validationEntity.setValidationName(w.getValidationName());
	                validationEntity.setValue(w.getValue());
	                validationEntities.add(validationEntity);
	            }
	        }
		return validationEntities;
	}

	
	public ProfileFieldGroupEntity updateProfileFieldGroupEntity( FormFieldGroup formFieldGroup,Map<Long, FieldGroupEntity> fldGrpMap, String profileName){
		FieldGroupEntity fieldGroupEntity =null;
    	ProfileFieldGroupEntity profileFieldGroupEntity =  null;
    	
    	if(formFieldGroup.getFieldGroup().getFieldGrpId() == null)
    	{
    		fieldGroupEntity = mapper.map(formFieldGroup.getFieldGroup(), FieldGroupEntity.class); 
    	}
    	else
    	{	
    	 fieldGroupEntity = fieldGroupRepository.getOne(formFieldGroup.getFieldGroup().getFieldGrpId().longValue());
    	 fldGrpMap.remove( formFieldGroup.getFieldGroup().getFieldGrpId().longValue());
    	 fieldGroupEntity = mapper.map( formFieldGroup.getFieldGroup() , FieldGroupEntity.class); 
    	 Optional<ProfileFieldGroupEntity> profileFieldGroupEntityOpt = profileFieldGroupRepository.getProfileFieldGroupForProfile( formFieldGroup.getFieldGroup().getFieldGrpId().longValue() ,profileName  );
    	   if(!profileFieldGroupEntityOpt.isPresent())
    	   {
    		 profileFieldGroupEntity = new ProfileFieldGroupEntity();
    	   }        	   
    	   else
    	   {
    		profileFieldGroupEntity = profileFieldGroupEntityOpt.get();  
    	   }
    		profileFieldGroupEntity.setFieldGroupEntity(fieldGroupEntity);
    		profileFieldGroupEntity.setGrpOrder( formFieldGroup.getGroupOrder() );
    		profileFieldGroupEntity.setProfileName( profileName );
    		profileFieldGroupEntity.setFieldGrpDeleteFl(false);
 	    	
    	}
		
      	return  profileFieldGroupEntity;  
	}
	
}
