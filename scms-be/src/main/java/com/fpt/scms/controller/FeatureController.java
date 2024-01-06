package com.fpt.scms.controller;

import com.fpt.scms.model.entity.Feature;
import com.fpt.scms.services.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasRole('ROLE_TEACHER') or hasRole(('STUDENT'))")
@RequestMapping("/api/features")
public class FeatureController {
    @Autowired
    FeatureService featureService;

    @GetMapping("/getFeatureByPage/{page}/{size}")
    public Page<Feature> getFeatureByPage(@PathVariable int page, @PathVariable int size){
        return featureService.getFeaturesByPage(PageRequest.of(page, size));
    }

    @PostMapping("/addFeature")
    public Feature addFeature(@RequestBody Feature feature){
        return featureService.addFeature(feature);
    }

    @GetMapping("/deleteFeature/{featureId}")
    public void deleteFeature(@PathVariable Long featureId){
        featureService.deleteFeature(featureId);
    }

    @GetMapping("/searchFeatureByName/{name}/{page}/{size}")
    public Page<Feature> searchFeatureByName(@PathVariable int page, @PathVariable int size,@PathVariable String name){
        return featureService.searchFeatureByName(PageRequest.of(page, size),name);
    }
}
