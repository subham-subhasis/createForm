package com.subex.onboarding.entity;



import javax.persistence.*;
import java.util.Date;

@Entity
@Table( name = "profile_field_group" )
public class ProfileFieldGroupEntity {
	    @Id
	    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "profile_field_group_generator")
	    @SequenceGenerator(name="profile_field_group_generator", sequenceName = "profile_field_group_seq", allocationSize=1)
	    @Column(name = "pfg_id")
	    private long id;

	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "field_grp_id")
	    private FieldGroupEntity fieldGroupEntity;

	    public long getId() {
	        return id;
	    }

	    public void setId(long id) {
	        this.id = id;
	    }

	    public FieldGroupEntity getFieldGroupEntity() {
	        return fieldGroupEntity;
	    }

	    public void setFieldGroupEntity(FieldGroupEntity fieldGroupEntity) {
	        this.fieldGroupEntity = fieldGroupEntity;
	    }

	    @Column(name = "grp_order")
	    private Integer grpOrder;

	    @Column(name = "profile_name")
	    private String profileName;

	    public Integer getGrpOrder() {
	        return grpOrder;
	    }

	    public void setGrpOrder(Integer grpOrder) {
	        this.grpOrder = grpOrder;
	    }

	    public String getProfileName() {
	        return profileName;
	    }

	    public void setProfileName(String profileName) {
	        this.profileName = profileName;
	    }

	    @Column(name = "field_grp_delete_fl")
	    //@Type(type = "true_false")
	    private Boolean fieldGrpDeleteFl = false;

	    @Column(name = "field_grp_created_date")
	    private Date createdDate = new Date();

	    @Column(name = "field_grp_modified_date")
	    private Date modifiedDate = new Date();
	    public Boolean getFieldGrpDeleteFl() {
	        return fieldGrpDeleteFl;
	    }

	    public void setFieldGrpDeleteFl(Boolean fieldGrpDeleteFl) {
	        this.fieldGrpDeleteFl = fieldGrpDeleteFl;
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
