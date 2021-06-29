package com.subex.onboarding.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table( name = "field_group" )
public class FieldGroupEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "field_group_generator")
    @SequenceGenerator(name="field_group_generator", sequenceName = "field_group_seq", allocationSize=1)
    @Column(name = "field_grp_id")
    private Long fieldGrpId;

    @Column(name = "field_grp_name", unique=true)
    private String fieldGrpName;

    @JsonIgnore
    private Integer groupOrder;

    @Column(name = "field_grp_delete_fl")
    private Boolean fieldGrpDeleteFl = false;

    @Column(name = "field_grp_created_date")
    private Date createdDate = new Date();

    @Column(name = "field_grp_modified_date")
    private Date modifiedDate = new Date();

    public Long getFieldGrpId() {
        return fieldGrpId;
    }

    public void setFieldGrpId(Long fieldGrpId) {
        this.fieldGrpId = fieldGrpId;
    }

    public String getFieldGrpName() {
        return fieldGrpName;
    }

    public void setFieldGrpName(String fieldGrpName) {
        this.fieldGrpName = fieldGrpName;
    }

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
