package com.subex.onboarding.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;


@Entity
@Table( name = "definition" )
public class DefinitionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "definition_generator")
    @SequenceGenerator(name="definition_generator", sequenceName = "definition_seq", allocationSize=1)
    @Column(name = "dfn_id")
    private Long dfnId;

    @Column(name = "dfn_name")
    private String dfnName;

    @Column(name = "dfn_category")
    private String dfnCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pfg_id")
    private ProfileFieldGroupEntity profileFieldGroupEntity;

    @Column(name = "mandatory_fl")
    private Boolean isMandatory;

    @Column(name = "mandatory_msg")
    private String mandatoryMsg;

    @Column(name = "action")
    private String action;

    @Column(name = "max_weightage")
    private Integer maxWeightage;

    @Column(name = "dfn_order")
    private Integer dfnOrder;

    @Column(name = "field_type")
    private String fieldType;

    @Column(name = "field_options")
    private String fieldOptions;

    @Column(name = "webscrap_fl")
    private Boolean isWebScrap;

    public Boolean getIsMandatory() {
		return isMandatory;
	}

	public void setIsMandatory(Boolean isMandatory) {
		this.isMandatory = isMandatory;
	}

	public Boolean getIsWebScrap() {
		return isWebScrap;
	}

	public void setIsWebScrap(Boolean isWebScrap) {
		this.isWebScrap = isWebScrap;
	}

	public Collection<ValidationEntity> getValidations() {
		return validations;
	}

	public void setValidations(Collection<ValidationEntity> validations) {
		this.validations = validations;
	}

	@OneToMany(targetEntity = WeightageEntity.class, fetch = FetchType.LAZY, mappedBy = "definitionEntity")
    private Collection<WeightageEntity> weightages = new ArrayList<WeightageEntity>();

    @OneToMany(targetEntity = ValidationEntity.class, fetch = FetchType.LAZY, mappedBy = "definitionEntity")
    private Collection<ValidationEntity> validations = new ArrayList<>();
    
    @Column(name = "profile_name")
    private String profileName;

    public String getDfnCategory() {
        return dfnCategory;
    }

    public void setDfnCategory(String dfnCategory) {
        this.dfnCategory = dfnCategory;
    }

    public ProfileFieldGroupEntity getProfileFieldGroupEntity() {
        return profileFieldGroupEntity;
    }

    public void setProfileFieldGroupEntity(ProfileFieldGroupEntity profileFieldGroupEntity) {
        this.profileFieldGroupEntity = profileFieldGroupEntity;
    }

    public Boolean getMandatory() {
        return isMandatory;
    }

    public void setMandatory(Boolean mandatory) {
        isMandatory = mandatory;
    }

    public String getMandatoryMsg() {
        return mandatoryMsg;
    }

    public void setMandatoryMsg(String mandatoryMsg) {
        this.mandatoryMsg = mandatoryMsg;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Integer getMaxWeightage() {
        return maxWeightage;
    }

    public void setMaxWeightage(Integer maxWeightage) {
        this.maxWeightage = maxWeightage;
    }

    public Integer getDfnOrder() {
        return dfnOrder;
    }

    public void setDfnOrder(Integer dfnOrder) {
        this.dfnOrder = dfnOrder;
    }

    public String getFieldType() {
        return fieldType;
    }

    public void setFieldType(String fieldType) {
        this.fieldType = fieldType;
    }

    public String getFieldOptions() {
        return fieldOptions;
    }

    public void setFieldOptions(String fieldOptions) {
        this.fieldOptions = fieldOptions;
    }

    public Boolean getWebScrap() {
        return isWebScrap;
    }

    public void setWebScrap(Boolean webScrap) {
        isWebScrap = webScrap;
    }

    public Collection<WeightageEntity> getWeightages() {
        return weightages;
    }

    public void setWeightages(Collection<WeightageEntity> weightages) {
        this.weightages = weightages;
    }

    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    @Column(name = "dfn_delete_fl")
   // @Type(type = "true_false")
    private Boolean dfnDeleteFl = false;

    @Column(name = "dfn_created_date")
    private Date createdDate = new Date();

    @Column(name = "dfn_modified_date")
    private Date modifiedDate = new Date();

    public String getDfnName() {
        return dfnName;
    }

    public void setDfnName(String dfnName) {
        this.dfnName = dfnName;
    }

    public Boolean getDfnDeleteFl() {
        return dfnDeleteFl;
    }

    public void setDfnDeleteFl(Boolean dfnDeleteFl) {
        this.dfnDeleteFl = dfnDeleteFl;
    }

    public Long getDfnId() {
        return dfnId;
    }

    public void setDfnId(Long dfnId) {
        this.dfnId = dfnId;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(Date modifiedDate) {
        this.modifiedDate = modifiedDate;
    }


}
