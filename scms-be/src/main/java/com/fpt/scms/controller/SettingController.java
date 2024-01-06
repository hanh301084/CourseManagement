package com.fpt.scms.controller;

import com.fpt.scms.model.dto.ClassSettingDTO;
import com.fpt.scms.model.dto.EvaluationCriteriaDTO;
import com.fpt.scms.model.dto.SettingDTO;
import com.fpt.scms.model.entity.EvaluationCriteria;
import com.fpt.scms.services.EvaluationCriteriaService;
import com.fpt.scms.services.PackageEvaluationService;
import com.fpt.scms.services.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/setting")
public class SettingController {
    @Autowired
    private SettingService settingService;
    @Autowired
    private PackageEvaluationService packageEvaluationService;
    @Autowired
    private EvaluationCriteriaService evaluationCriteriaService;

    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT') or hasRole('ROLE_TEACHER')")
    @RequestMapping(value = "class-block5-setting/{semesterId}", method = RequestMethod.GET, produces = "application/json")
    public SettingDTO ClassBlock5Setting( @PathVariable Long semesterId) {
        return settingService.findSettingForClassBlock5(semesterId );
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT') or hasRole('ROLE_TEACHER')")
    @RequestMapping(value = "class-block10-setting/{semesterId}", method = RequestMethod.GET, produces = "application/json")
    public SettingDTO ClassBlock10Setting( @PathVariable Long semesterId) {
        return settingService.findSettingForClassBlock10(semesterId);
    }
    @RequestMapping(value = "update",  method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> updateSettings(@RequestBody ClassSettingDTO classSettingDTO) {
        try {
            settingService.updateClassSetting(classSettingDTO.getBlock5Setting(), classSettingDTO.getBlock10Setting(), classSettingDTO.getSemesterId());
            return ResponseEntity.ok("Settings updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update settings: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT') or hasRole('ROLE_TEACHER') or hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "iterations/{semesterId}",  method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<SettingDTO>> getIterationSettingsBySemesterId(@PathVariable(required = false) Long semesterId) {
        List<SettingDTO> iterationSettings = settingService.findIterationSettingsBySemesterId(semesterId);
        return ResponseEntity.ok(iterationSettings);
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT') or hasRole('ROLE_TEACHER') or hasRole('ROLE_STUDENT') or hasRole('ROLE_REVIEWER')")
    @RequestMapping(value = "/iteration", method = RequestMethod.GET, produces = "application/json")
    public List<EvaluationCriteriaDTO> getAllEvaluationCriteria(
            @RequestParam Long semesterId,
            @RequestParam String classType)
    {
        return  evaluationCriteriaService.getAllEvaluationCriteria(semesterId, classType);
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT') or hasRole('ROLE_TEACHER') or hasRole('ROLE_STUDENT') or hasRole('ROLE_REVIEWER')")
    @RequestMapping(value = "/iterationEachIter", method = RequestMethod.GET, produces = "application/json")
    public EvaluationCriteriaDTO getAllEvaluationCriteriaEachIter(
            @RequestParam Long semesterId,
            @RequestParam String classType,
            @RequestParam Long iterationId)
    {
        return  evaluationCriteriaService.getAllEvaluationCriteriaEachIter(semesterId, classType, iterationId);
    }
    @RequestMapping(value = "/iteration/update", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> updateEvaluationCriteria(@RequestBody List<EvaluationCriteriaDTO> evaluationCriteriaDTOS) {
        try {
            evaluationCriteriaService.updateIterationWeights(evaluationCriteriaDTOS);
            return ResponseEntity.ok("Evaluation criteria updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update evaluation criteria: " + e.getMessage());
        }
    }
    @RequestMapping(value = "/iterationFinal", method = RequestMethod.GET, produces = "application/json")
    public List<EvaluationCriteriaDTO> getAllEvaluationCriteriaFinal(
            @RequestParam Long semesterId)
    {
        return  evaluationCriteriaService.getAllEvaluationCriteriaFinal(semesterId);
    }
    @RequestMapping(value = "/iterationFinal2", method = RequestMethod.GET, produces = "application/json")
    public List<EvaluationCriteriaDTO> getAllEvaluationCriteriaFinal2(
            @RequestParam Long semesterId)
    {
        return  evaluationCriteriaService.getAllEvaluationCriteriaFinal2(semesterId);
    }
    @RequestMapping(value = "/iterationOG", method = RequestMethod.GET, produces = "application/json")
    public List<EvaluationCriteriaDTO> getAllEvaluationCriteriaOG(
            @RequestParam Long semesterId,
            @RequestParam String classType)
    {
        return  evaluationCriteriaService.getAllEvaluationCriteriaOG(semesterId, classType);
    }

    @RequestMapping(value = "/criteria/updateOngoing", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> updateEvaluationCriteriaOngoing(@RequestBody EvaluationCriteriaDTO evaluationCriteriaDTO) {
        try {
            evaluationCriteriaService.updateIterationCriteriaOngoing(evaluationCriteriaDTO);
            return ResponseEntity.ok("Evaluation criteria updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update evaluation criteria: " + e.getMessage());
        }
    }
    @RequestMapping(value = "/criteria/updateFinal", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> updateEvaluationCriteriaFinal(@RequestBody List<EvaluationCriteriaDTO> evaluationCriteriaDTOS) {
        try {
            evaluationCriteriaService.updateEvaluationCriteriaFinal(evaluationCriteriaDTOS);
            return ResponseEntity.ok("Evaluation criteria updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update evaluation criteria: " + e.getMessage());
        }
    }

    @RequestMapping(value = "/criteria/updateFinal2", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> updateEvaluationCriteriaFinal2(@RequestBody List<EvaluationCriteriaDTO> evaluationCriteriaDTOS) {
        try {
            evaluationCriteriaService.updateEvaluationCriteriaFinal2(evaluationCriteriaDTOS);
            return ResponseEntity.ok("Evaluation criteria updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update evaluation criteria: " + e.getMessage());
        }
    }

    @RequestMapping(value = "/getEvaluationCriteriaCalculate", method = RequestMethod.GET, produces = "application/json")
    public EvaluationCriteria getEvaluationCriteriaCalculate(
            @RequestParam Long semesterId,
            @RequestParam String classType,
            @RequestParam String iterationName)

    {
        return  evaluationCriteriaService.getEvaluationCriteriaCalculate(semesterId, classType, iterationName);
    }

    @RequestMapping(value ="/findEvaluationCriteriaBySemesterId/{semesterId}",method = RequestMethod.GET, produces = "application/json")
    public EvaluationCriteriaDTO findEvaluationCriteriaBySemesterId(@PathVariable  Long semesterId){
        return evaluationCriteriaService.findEvaluationCriteriaBySemesterId(semesterId);
    }
}
