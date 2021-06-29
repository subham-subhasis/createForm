package com.subex.onboarding.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.subex.onboarding.entity.DefinitionEntity;
import com.subex.onboarding.entity.InfoDataEntity;


@Repository
public interface InfoDataEntityRepository extends JpaRepository<InfoDataEntity, Long> {
	
	@Query("from InfoDataEntity d where d.definitionEntity = :definitionEntity and dfnVal = :dfnVal")
    List<InfoDataEntity> findAllInfoDataEntityByDfn(@Param("definitionEntity") DefinitionEntity definitionEntity, @Param("dfnVal") String dfnVal);
	
}
