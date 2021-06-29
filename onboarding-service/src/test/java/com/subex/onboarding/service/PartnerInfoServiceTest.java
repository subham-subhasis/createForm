package com.subex.onboarding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.subex.onboarding.entity.DefinitionEntity;
import com.subex.onboarding.entity.InfoDataEntity;
import com.subex.onboarding.entity.PartnerInfoEntity;
import com.subex.onboarding.model.InfoData;
import com.subex.onboarding.model.PartnerInfo;
import com.subex.onboarding.model.Response;
import com.subex.onboarding.repository.DefinitionRepository;
import com.subex.onboarding.repository.InfoDataEntityRepository;
import com.subex.onboarding.repository.PartnerInfoEntityRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest 
public class PartnerInfoServiceTest {
	
	   @Autowired
	   private PartnerInfoService partnerInfoService;
	  
	    @MockBean
	    DefinitionRepository definitionRepositoryMock;
	    
	    @MockBean
		PartnerInfoEntityRepository partnerInfoEntityRepositoryMock;

	    @MockBean
		InfoDataEntityRepository infoDataEntityRepositoryMock;
	    
	    public DefinitionEntity setDefinitionEntity(long dfnId ,String dfnName,String fieldType) {
	    	DefinitionEntity definitionEntity= new DefinitionEntity();
	    	definitionEntity.setDfnId(dfnId);
	    	definitionEntity.setDfnName(dfnName);
	    	definitionEntity.setFieldType(fieldType);
	    	return definitionEntity;		
	    	}
	    
	    public InfoDataEntity setInfoDataEntity(long infoId ,String infoValue,PartnerInfoEntity partnerInfoEntity ,byte[] infoblob) {
	    	InfoDataEntity inf =new InfoDataEntity();
	    	inf.setId(infoId);
	    	inf.setDfnVal(infoValue);
	    	inf.setDfnBlobVal(infoblob);
	    	inf.setPartnerInfoEntity(partnerInfoEntity);
	    	return inf;		
	    	}
	    public InfoData setInfoData(Integer id, String dfnName,String defvalue) {
	    	InfoData inf =new InfoData();
	    	inf.setDfnId(id);
	    	inf.setDfnName(dfnName);
	    	inf.setDfnVal(defvalue);
	    	return inf;	
	             }
	    public PartnerInfo setrPartnerInfo()
	    {
	    	InfoData inf =setInfoData(1,"First Name", "Santosh");
	    	InfoData inf2 =setInfoData(2,"Last Name", "Haller");
	    	InfoData inf3=setInfoData(3,"Email", "santosh.haller@subex.com");
	    	InfoData inf4 =setInfoData(4,"Company Name", "subex");
	    	List<InfoData> infos = new ArrayList();
	    	infos.add(inf);
	    	infos.add(inf2);
	    	infos.add(inf3);
	    	infos.add(inf4);
	    	
	    	PartnerInfo partnerInfo= new PartnerInfo();
	    	partnerInfo.setProfileName("SMS");
	    	partnerInfo.setInfoData(infos);
	    	
	    	return partnerInfo;
	    }
	    
	    @Test
	    public void createPartnerInfoTest()
	    {
	    	DefinitionEntity df1= setDefinitionEntity(1,"First Name","input");
	    	DefinitionEntity df2= setDefinitionEntity(2,"Last Name","input");
	    	DefinitionEntity df3= setDefinitionEntity(3,"Email","input");
	    	DefinitionEntity df4= setDefinitionEntity(4,"Company Name","input");
	    	//DefinitionEntity df5= setDefinitionEntity(5,"Logo","file");
	    	
	    	List<DefinitionEntity> definitions = new ArrayList();
	    	definitions.add(df1);
	    	definitions.add(df2);
	    	definitions.add(df3);
	    	definitions.add(df4);
	    	PartnerInfoEntity pinf=new PartnerInfoEntity();
	    	pinf.setPartnerId(1);
	    	pinf.setProfileName("SMS");
	    	pinf.setEmailSerivice("Success");
	    	
	    	InfoDataEntity inf =setInfoDataEntity(1, "Santosh", pinf, null);
	    	InfoDataEntity inf2 =setInfoDataEntity(2, "Haller", pinf, null);
	    	InfoDataEntity inf3 =setInfoDataEntity(3, "santosh.haller@subex.com", pinf, null);
	    	InfoDataEntity inf4 =setInfoDataEntity(4, "Subex", pinf, null);
	    	List<InfoDataEntity> infodatas = new ArrayList();
	    	infodatas.add(inf);
	    	infodatas.add(inf2);
	    	infodatas.add(inf3);
	    	infodatas.add(inf4);
	    	when(definitionRepositoryMock.findAll()).thenReturn(definitions);
	    	when(infoDataEntityRepositoryMock.saveAll(infodatas)).thenReturn(infodatas);
			when(partnerInfoEntityRepositoryMock.save(pinf)).thenReturn(pinf);
			
			PartnerInfo partnerInfo= setrPartnerInfo();
			
			Response response = new Response();
			response.setStatus("Success");
			response.setStatusCode(HttpStatus.CREATED+""); 
			ResponseEntity<Response> responsEntExpec =new ResponseEntity<>(response, HttpStatus.CREATED);

		   ResponseEntity<Response> responsEnt =partnerInfoService.createpartnerInfoEntity(partnerInfo);
		   assertEquals(responsEntExpec, responsEnt);
		  
			
			
	    }
	    
	    
}
