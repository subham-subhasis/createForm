package com.subex.onboarding.standard;


import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.subex.onboarding.api.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest 
public class SmokeTest {
    @Autowired
	private ProfileinfosApiController profileinfosApiController;
	
    @Autowired
	private FieldgroupsApiController fieldgroupsApiController;

    @Autowired
	private PartnerinfosApiController partnerinfosApiController;
	
	@Test
    public void contexLoads() throws Exception {
		assertThat(profileinfosApiController).isNotNull();
		assertThat(fieldgroupsApiController).isNotNull();
		assertThat(partnerinfosApiController).isNotNull();
		
    }
}
