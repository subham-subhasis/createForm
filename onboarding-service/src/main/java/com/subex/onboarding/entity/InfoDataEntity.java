package com.subex.onboarding.entity;

import javax.persistence.*;


/**
 * Nested Info for partner
 */
@Entity
@Table( name = "info_data" )
public class InfoDataEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "info_data_generator")
    @SequenceGenerator(name="info_data_generator", sequenceName = "info_data_seq", allocationSize=1)
	@Column(name = "inf_id")
	private long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "prt_id")
	private PartnerInfoEntity partnerInfoEntity;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dfn_id")
	private DefinitionEntity definitionEntity;

	@Column(name = "inf_value")
	private String dfnVal;

	@Lob
	@Column(name = "inf_blob_value",length = 100000)
	private byte[] dfnBlobVal;

	@Column(name = "inf_blob_type")
	private String dfnBlobType;

	public String getDfnBlobType() {
		return dfnBlobType;
	}

	public void setDfnBlobType(String dfnBlobType) {
		this.dfnBlobType = dfnBlobType;
	}

	@Column(name = "pre_onboard_score")
	private Double preOnBoardScore;

	public byte[] getDfnBlobVal() {
		return dfnBlobVal;
	}

	public void setDfnBlobVal(byte[] dfnBlobVal) {
		this.dfnBlobVal = dfnBlobVal;
	}

	public Double getPreOnBoardScore() {
		return preOnBoardScore;
	}

	public void setPreOnBoardScore(Double preOnBoardScore) {
		this.preOnBoardScore = preOnBoardScore;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public DefinitionEntity getDefinitionEntity() {
		return definitionEntity;
	}

	public void setDefinitionEntity(DefinitionEntity definitionEntity) {
		this.definitionEntity = definitionEntity;
	}

	public String getDfnVal() {
		return dfnVal;
	}

	public void setDfnVal(String dfnVal) {
		this.dfnVal = dfnVal;
	}

	public PartnerInfoEntity getPartnerInfoEntity() {
		return partnerInfoEntity;
	}

	public void setPartnerInfoEntity(PartnerInfoEntity partnerInfoEntity) {
		this.partnerInfoEntity = partnerInfoEntity;
	}
	
	

}
