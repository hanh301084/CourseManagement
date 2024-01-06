package com.fpt.scms.services;

import com.fpt.scms.model.entity.Feature;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FeatureService {
    Page<Feature> getFeaturesByPage(Pageable pageable);
    Feature addFeature(Feature feature);
    void deleteFeature(Long featureId);
    Page<Feature>  searchFeatureByName(Pageable pageable,String featureName);
}
