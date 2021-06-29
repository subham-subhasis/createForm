package com.subex.onboarding.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.subex.onboarding.entity.ProfileFieldGroupEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileFieldGroupRepository extends JpaRepository<ProfileFieldGroupEntity, Long>
{

    @Query(" from ProfileFieldGroupEntity p where p.fieldGroupEntity.fieldGrpId = :fieldGrpId and  p.profileName = :profileName")
    Optional<ProfileFieldGroupEntity> getProfileFieldGroupForProfile(@Param("fieldGrpId") Long fieldGrpId, @Param("profileName") String profileName);

    @Query("select distinct(profileName) from ProfileFieldGroupEntity ")
    List<String> getProfiles();
}
