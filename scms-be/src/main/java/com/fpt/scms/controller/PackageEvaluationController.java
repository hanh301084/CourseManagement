package com.fpt.scms.controller;

import com.fpt.scms.model.entity.PackageEvaluation;
import com.fpt.scms.services.PackageEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import com.fpt.scms.model.dto.OngoingDataDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packageEvaluation")
public class PackageEvaluationController {
    @Autowired
    PackageEvaluationService packageEvaluationService;

    @RequestMapping(value = "/getPackageEvaluationByClassUserId/{classUserId}", method = RequestMethod.GET, produces ="application/json")
    public List<PackageEvaluation> getPackageEvaluationByClassUserId(@PathVariable Long classUserId) {
        return packageEvaluationService.getPackageEvaluationByClassUserId(classUserId);
    }

    @RequestMapping(value = "/sendOGGrade", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> updatePackageEvaluationOG1(@RequestBody OngoingDataDTO ongoingDataDTO) {
        try {
            packageEvaluationService.updatePackageEvaluationOG(ongoingDataDTO);
            return ResponseEntity.ok("Evaluation criteria updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed: " + e.getMessage());
        }
    }
    @RequestMapping(value = "/getupdateOgGrade/", method = RequestMethod.GET, produces ="application/json")
    public double getupdateOgGrade( double ogGrade) {
        return packageEvaluationService.getupdateOgGrade(ogGrade);
    }

    @RequestMapping(value = "/getPackageWeight", method = RequestMethod.GET, produces = "application/json")
    public PackageEvaluation getPackageWeightByClassUser(
            @RequestParam Long classUserId,
            @RequestParam Long semesterId,
            @RequestParam String classType,
            @RequestParam String iterationName)
    {
        return packageEvaluationService.getPackageWeightByClassUser(semesterId,classType,iterationName,classUserId);
    }

    @RequestMapping(value = "/calculatePresentationByClassUserId", method = RequestMethod.GET, produces = "application/json")
    public float calculatePresentationByClassUserId(@RequestParam Long classUserId,@RequestParam boolean isPresentation,@RequestParam Long teamId,
                                                    @RequestParam Long semesterId, @RequestParam String classType) {
        return packageEvaluationService.calculatePresentationByClassUserId(classUserId,isPresentation,teamId, semesterId, classType);
    }
}
