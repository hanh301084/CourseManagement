package com.fpt.scms.repository;

import com.fpt.scms.model.entity.Feature;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeatureRepository extends JpaRepository<Feature,Long> {
    @Query(value = "select f from Feature f order by f.featureId desc")
    Page<Feature> getFeaturesByPage(Pageable pageable);
    @Query("SELECT f FROM Feature f WHERE f.featureName LIKE %:featureName% ORDER BY f.featureId DESC")
    Page<Feature> searchByName(Pageable pageable,@Param("featureName") String featureName);
    Feature findFeatureByFeatureName(String featureName);
    Feature findByFeatureId(Long featureId);
}
