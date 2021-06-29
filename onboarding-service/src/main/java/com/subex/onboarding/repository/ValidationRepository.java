package com.subex.onboarding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.subex.onboarding.entity.ValidationEntity;

@Repository
public interface ValidationRepository extends JpaRepository<ValidationEntity, Long> {
	@Query("from ValidationEntity v where v.definitionEntity.dfnId in(select d.dfnId from DefinitionEntity d where d.profileName = :profileName)")
    List<ValidationEntity> findAllValdForProfile(@Param("profileName") String profileName);

}
