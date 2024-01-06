package com.fpt.scms.services.Impl;

import com.fpt.scms.model.entity.Feature;
import com.fpt.scms.repository.FeatureRepository;
import com.fpt.scms.services.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FeatureServiceImpl implements FeatureService {
    @Autowired
    FeatureRepository featureRepository;
    @Override
    public Page<Feature> getFeaturesByPage(Pageable pageable) {
        return featureRepository.getFeaturesByPage(pageable);
    }

    @Override
    public Feature addFeature(Feature feature) {
        return featureRepository.save(feature);
    }

    @Override
    public void deleteFeature(Long featureId) {
        featureRepository.deleteById(featureId);
    }

    @Override
    public Page<Feature> searchFeatureByName(Pageable pageable,String featureName) {
        return featureRepository.searchByName(pageable,featureName);
    }


}
