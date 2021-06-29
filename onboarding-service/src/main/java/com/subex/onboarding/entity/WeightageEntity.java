package com.subex.onboarding.entity;

import javax.persistence.*;



@Entity
@Table( name = "dfn_weightages" )
public class WeightageEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dfn_weightages_generator")
  @SequenceGenerator(name="dfn_weightages_generator", sequenceName = "dfn_weightages_seq", allocationSize=1)
  @Column(name = "dw_id")
  private Long id;

  @Column(name = "type")
  private String type;

  @Column(name = "weightage_val")
  private Double weightageVal;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "dfn_id")
  private DefinitionEntity definitionEntity;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Double getWeightageVal() {
    return weightageVal;
  }

  public void setWeightageVal(Double weightageVal) {
    this.weightageVal = weightageVal;
  }

  public DefinitionEntity getDefinitionEntity() {
    return definitionEntity;
  }

  public void setDefinitionEntity(DefinitionEntity definitionEntity) {
    this.definitionEntity = definitionEntity;
  }
}

