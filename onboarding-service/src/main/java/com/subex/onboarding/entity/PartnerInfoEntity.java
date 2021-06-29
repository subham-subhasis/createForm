package com.subex.onboarding.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "partner_info")
public class PartnerInfoEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "partner_info_generator")
	@SequenceGenerator(name="partner_info_generator", sequenceName = "partner_info_seq", allocationSize=1)
	@Column(name = "prt_id")
	private long partnerId;

	@Column(name = "profile_name")
	private String profileName;

	@OneToMany(targetEntity = InfoDataEntity.class, fetch = FetchType.LAZY, mappedBy = "partnerInfoEntity")
	private Collection<InfoDataEntity> infos = new ArrayList<>();

	@Column(name = "prt_delete_fl")
	private Boolean dfnDeleteFl = false;

	@Column(name = "prt_created_date")
	private Date createdDate = new Date();

	@Column(name = "prt_modified_date")
	private Date modifiedDate = new Date();
	
	@Column(name = "transcation_ID")
	private String transcationId;
	
	@Column(name = "email_service")
	private String emailSerivice;
	
	@Column(name = "user_name")
	private String userName;
	
	@Column(name = "password_status")
	private boolean passwordStatus;
	
	@Column(name = "registration_code")
	private String registrationCode;
	
	@Column(name = "wf_processs_instance_id")
	private Integer wfProcessInstanceId;
	
	@Column(name = "work_step_team")
	private String workStepTeam;
	
	@Column(name = "status_in_work_step_team")
	private String statusInWorkStepTeam;

	public Boolean getPanelDataExists() {
		return panelDataExists;
	}

	public void setPanelDataExists(Boolean panelDataExists) {
		this.panelDataExists = panelDataExists;
	}

	@Column(name = "panel_data_exists")
	private Boolean panelDataExists;
	
	public Integer getWfProcessInstanceId() {
		return wfProcessInstanceId;
	}

	public void setWfProcessInstanceId(Integer wfProcessInstanceId) {
		this.wfProcessInstanceId = wfProcessInstanceId;
	}

	public String getWorkStepTeam() {
		return workStepTeam;
	}

	public void setWorkStepTeam(String workStepTeam) {
		this.workStepTeam = workStepTeam;
	}

	public String getStatusInWorkStepTeam() {
		return statusInWorkStepTeam;
	}

	public void setStatusInWorkStepTeam(String statusInWorkStepTeam) {
		this.statusInWorkStepTeam = statusInWorkStepTeam;
	}

	public String getTranscationId() {
		return transcationId;
	}

	public void setTranscationId(String transcationId) {
		this.transcationId = transcationId;
	}


	public String getUserName() {
		return userName;
	}

	public String getRegistrationCode() {
		return registrationCode;
	}

	public void setRegistrationCode(String registrationCode) {
		this.registrationCode = registrationCode;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public boolean isPasswordStatus() {
		return passwordStatus;
	}

	public void setPasswordStatus(boolean passwordStatus) {
		this.passwordStatus = passwordStatus;
	}

	public String getEmailSerivice() {
		return emailSerivice;
	}

	public void setEmailSerivice(String emailSerivice) {
		this.emailSerivice = emailSerivice;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getBlockChainStatus() {
		return blockChainStatus;
	}

	public void setBlockChainStatus(String blockChainStatus) {
		this.blockChainStatus = blockChainStatus;
	}

	@Column(name = "status")
	private String status;

	@Column(name = "block_chain_status")
	private String blockChainStatus;

	public Double getPreOnBoardScore() {
		return preOnBoardScore;
	}

	public void setPreOnBoardScore(Double preOnBoardScore) {
		this.preOnBoardScore = preOnBoardScore;
	}

	public void setPostOnBoardScore(Double postOnBoardScore) {
		this.postOnBoardScore = postOnBoardScore;
	}

	public Double getPostOnBoardScore() {
		return postOnBoardScore;
	}

	@Column(name = "pre_onboard_score")
	private Double preOnBoardScore;

	@Column(name = "post_onboard_score")
	private Double postOnBoardScore;

	

	public long getPartnerId() {
		return partnerId;
	}

	public void setPartnerId(long partnerId) {
		this.partnerId = partnerId;
	}

	public String getProfileName() {
		return profileName;
	}

	public void setProfileName(String profileName) {
		this.profileName = profileName;
	}

	public Collection<InfoDataEntity> getInfos() {
		return infos;
	}

	public void setInfos(Collection<InfoDataEntity> infos) {
		this.infos = infos;
	}

	public Boolean getDfnDeleteFl() {
		return dfnDeleteFl;
	}

	public void setDfnDeleteFl(Boolean dfnDeleteFl) {
		this.dfnDeleteFl = dfnDeleteFl;
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
