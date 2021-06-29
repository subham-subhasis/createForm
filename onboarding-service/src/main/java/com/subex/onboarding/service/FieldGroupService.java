package com.subex.onboarding.service;

import java.util.ArrayList;
import java.util.List;
import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.subex.onboarding.api.FieldgroupsApiDelegate;
import com.subex.onboarding.entity.FieldGroupEntity;
import com.subex.onboarding.model.FieldGroupEntry;
import com.subex.onboarding.model.FieldGroupModel;
import com.subex.onboarding.model.Response;
import com.subex.onboarding.repository.FieldGroupRepository;
import com.subex.ngp.audit.trail.lib.AuditEventModel;

@Service
public class FieldGroupService implements FieldgroupsApiDelegate {

    DozerBeanMapper mapper = new DozerBeanMapper();
    @Autowired
    FieldGroupRepository fieldGroupRepository;

    String status="Success";
    
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ResponseEntity<List<FieldGroupModel>> listFieldGroups() {
    	
        List<FieldGroupModel> fieldGroupModelList = new ArrayList<>();
        List<FieldGroupEntity> fieldGroups = fieldGroupRepository.findAll(Sort.by("fieldGrpName").ascending());
        fieldGroups.forEach(fieldGroup -> {
            FieldGroupModel fieldGroupModel = mapper.map(fieldGroup, FieldGroupModel.class);
            fieldGroupModelList.add( fieldGroupModel );
        });
        AuditEventModel.callAuditLog("FIELD-GROUP-ENTITY", "Fetch all field groups", "Fetching all field groups. List of FieldGroup is sent in response.", "success");
        return new ResponseEntity<>(fieldGroupModelList,HttpStatus.OK);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ResponseEntity<Response> createFieldGroup(FieldGroupEntry fieldGroupEntry) {  	
        FieldGroupEntity fieldGroupEntity = new FieldGroupEntity();
        Response response = new Response();
        fieldGroupEntity.setFieldGrpName(fieldGroupEntry.getFieldGrpName()); 
        fieldGroupRepository.save(fieldGroupEntity);       
        response.setStatus(status);
        response.setStatusCode(HttpStatus.CREATED+""); 
        AuditEventModel.callAuditLog("FIELD-GROUP-ENTITY", "Create a Field Group", "Created a Field Group with name: "+fieldGroupEntry.getFieldGrpName(), "success");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
 
  }

}
