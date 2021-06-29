package com.subex.onboarding.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.subex.ngp.audit.trail.lib.AuditEventModel;
import com.subex.onboarding.api.ProfilesApiDelegate;
import com.subex.onboarding.model.Profile;
import com.subex.onboarding.repository.ProfileFieldGroupRepository;

@Service
public class ProfileService implements ProfilesApiDelegate {

    @Autowired
    ProfileFieldGroupRepository profileFieldGroupRepository;
    
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ResponseEntity<List<Profile>> getprofiles() {
        List<String> profiles = profileFieldGroupRepository.getProfiles();
        List<Profile> profileList = new ArrayList<>();
        for(String profileName : profiles )
        {
            Profile profile  = new Profile();
            profile.setProfileName(profileName);
            profileList.add(profile);
        }
        AuditEventModel.callAuditLog("PROFILE-FIELD-GROUP-ENTITY", "Fetch ALL Profile", "All Profiles list fetched successfully.", "success");
        return  new ResponseEntity<>( profileList , HttpStatus.OK );
    }


}
