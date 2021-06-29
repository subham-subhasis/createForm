package com.subex.onboarding.helper;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class PanelData {

	private String name ;
	private Boolean result ;
	
	@JsonIgnore
	private SourceInfo sourceInfo;
	
	public SourceInfo getSourceInfo() {
		return sourceInfo;
	}
	public void setSourceInfo(SourceInfo sourceInfo) {
		this.sourceInfo = sourceInfo;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Boolean getResult() {
		return result;
	}
	public void setResult(Boolean result) {
		this.result = result;
	} 
}
