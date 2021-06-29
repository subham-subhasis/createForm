package com.subex.onboarding.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table( name = "dfn_validations" )
public class ValidationEntity {
	
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "validation_id_generator")
    @SequenceGenerator(name="validation_id_generator", sequenceName = "validation_id_seq", allocationSize=1)
    @Column(name = "validation_id")
	private long valId;
	
	@Column(name = "validation_name")
	private String validationName;
		
	@Column(name = "validation_msg")
	private String validationMsg;
	
	@Column(name = "value")
	private String value ;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dfn_id")
	private DefinitionEntity definitionEntity;
	
	public long getValId() {
		return valId;
	}
	public void setValId(long valId) {
		this.valId = valId;
	}
	public DefinitionEntity getDefinitionEntity() {
		return definitionEntity;
	}
	public void setDefinitionEntity(DefinitionEntity definitionEntity) {
		this.definitionEntity = definitionEntity;
	}
	public void setValidationName(String validationName) {
		this.validationName = validationName;
	}
	public void setValidationMsg(String validationMsg) {
		this.validationMsg = validationMsg;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getValidationName() {
		return validationName;
	}
	public String getValidationMsg() {
		return validationMsg;
	}
	public String getValue() {
		return value;
	}
	

}
