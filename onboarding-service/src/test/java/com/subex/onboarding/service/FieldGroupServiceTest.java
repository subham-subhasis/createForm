package com.subex.onboarding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.subex.onboarding.entity.FieldGroupEntity;
import com.subex.onboarding.model.FieldGroupEntry;
import com.subex.onboarding.model.FieldGroupModel;
import com.subex.onboarding.model.Response;
import com.subex.onboarding.repository.FieldGroupRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class FieldGroupServiceTest {
	
	
	 @Autowired
	 private FieldGroupService fieldGroupService;
	 
	 @MockBean
	 FieldGroupRepository fieldGroupRepositoryMock;
	 
	    @Test
		public void createFieldGroupTest() {
	    	
	    	FieldGroupEntity fieldGroupEntity=new FieldGroupEntity();
			fieldGroupEntity.setFieldGrpId((long) 1);
			fieldGroupEntity.setFieldGrpName("Admin Details"); 
					
			when(fieldGroupRepositoryMock.save(fieldGroupEntity)).thenReturn(fieldGroupEntity);
			FieldGroupEntry fieldGroupEntry =new FieldGroupEntry();	
			fieldGroupEntry.setFieldGrpName("Admin Details");
			
			Response response = new Response();
			response.setStatus("Success");
			response.setStatusCode(HttpStatus.CREATED+""); 
			ResponseEntity<Response> responsEntExpec =new ResponseEntity<>(response, HttpStatus.CREATED);
		   ResponseEntity<Response> responsEnt =fieldGroupService.createFieldGroup(fieldGroupEntry);
		   assertEquals(responsEntExpec, responsEnt);
		   
		  }
	    
	    @Test
		public void listFieldGroupsTest() {
	    	
	    	FieldGroupEntity fieldGroupEntity1=new FieldGroupEntity();
			fieldGroupEntity1.setFieldGrpId((long) 1);
			fieldGroupEntity1.setFieldGrpName("Basic Details"); 
			
			FieldGroupEntity fieldGroupEntity2=new FieldGroupEntity();
			fieldGroupEntity2.setFieldGrpId((long) 2);
			fieldGroupEntity2.setFieldGrpName("Finance Details"); 
			
			List<FieldGroupEntity> fieldGroups = new ArrayList<>();	
			fieldGroups.add(fieldGroupEntity1);
			fieldGroups.add(fieldGroupEntity2);
			
			when(fieldGroupRepositoryMock.findAll(Sort.by("fieldGrpName").ascending())).thenReturn(fieldGroups);

			ResponseEntity<List<FieldGroupModel>> responsEnt =fieldGroupService.listFieldGroups();
		    for(FieldGroupModel fld: responsEnt.getBody() )
		    {
		    	if("Basic Details".equalsIgnoreCase(fld.getFieldGrpName()))
			          assertEquals("Basic Details", fld.getFieldGrpName());
		    }
		  }
	    
	    

}
