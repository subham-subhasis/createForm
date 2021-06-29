package com.subex.onboarding.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.subex.onboarding.entity.FieldGroupEntity;
@Repository
public interface FieldGroupRepository extends JpaRepository <FieldGroupEntity, Long>
{
	 @Query("from FieldGroupEntity f where f.fieldGrpId in (select p.fieldGroupEntity.fieldGrpId from ProfileFieldGroupEntity p where p.profileName = :profileName)")
	  List<FieldGroupEntity> findAllFldGrpForProfile(@Param("profileName") String profileName);
}
