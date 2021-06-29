package com.subex.onboarding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.subex.onboarding.entity.WeightageEntity;

@Repository
public interface WeighatgeEntityRepository extends JpaRepository<WeightageEntity, Long>
{
	@Query("from WeightageEntity w where w.definitionEntity.dfnId in(select d.dfnId from DefinitionEntity d where d.profileName = :profileName)")
    List<WeightageEntity> findAllWgtForProfile(@Param("profileName") String profileName);
}
