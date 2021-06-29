package com.subex.onboarding.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.subex.onboarding.entity.PartnerInfoEntity;



@Repository
public interface PartnerInfoEntityRepository extends JpaRepository<PartnerInfoEntity, Long>{

	@Query("from PartnerInfoEntity p where p.partnerId in( select i.partnerInfoEntity.partnerId from InfoDataEntity i where i.dfnVal = :dfnValue and i.definitionEntity.dfnName = :dfnName )")
	Optional<PartnerInfoEntity> findByDfnName(@Param("dfnValue") String dfnValue ,@Param("dfnName") String dfnName);
	
	@Query("from PartnerInfoEntity p where p.userName = :userName")
	Optional<PartnerInfoEntity> findByUserName(@Param("userName") String userName);
}
