package com.fpt.scms.controller;

import com.fpt.scms.model.dto.EstimateLocDTO;
import com.fpt.scms.model.dto.FunctionEstimateLocDTO;
import com.fpt.scms.model.dto.FunctionTypeDTO;
import com.fpt.scms.model.dto.TechnologyDTO;
import com.fpt.scms.model.entity.EstimateLoc;
import com.fpt.scms.services.EstimateLocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estimateLoc")
public class EstimateLocController {

    @Autowired
    EstimateLocService estimateLocService;

        @RequestMapping(value = "/getAllFunctionTypes",method = RequestMethod.GET,produces = "application/json")
    public List<FunctionTypeDTO> getAllFunctionTypes(){
        return estimateLocService.getAllFunctionTypes();
    }

    @RequestMapping(value = "/getAllActiveFunctionTypes",method = RequestMethod.GET,produces = "application/json")
    public List<FunctionTypeDTO> getAllActiveFunctionTypes(){
        return estimateLocService.getAllFunctionTypesActive();
    }

    @RequestMapping(value = "/getAllTechnology",method = RequestMethod.GET,produces = "application/json")
    public List<TechnologyDTO> getAllTechnology(){
        return estimateLocService.getAllTechnology();
    }


    @RequestMapping(value = "/getAllActiveTechnology",method = RequestMethod.GET,produces = "application/json")
    public List<TechnologyDTO> getAllActiveTechnology(){
        return estimateLocService.getAllTechnologyActive();
    }

    @RequestMapping(value = "/getAllEstimateLoc",method = RequestMethod.GET,produces = "application/json")
    public List<EstimateLocDTO> getAllEstimateLoc(){
        return estimateLocService.getAllEstimateLoc();
    }
    @RequestMapping(value = "/getAllFunctionEstimateLoc",method = RequestMethod.GET,produces = "application/json")
    public List<FunctionEstimateLocDTO> getAllFunctionEstimateLoc(){
        return estimateLocService.getAllFunctionEstimateLoc();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST, produces = "application/json")
    public EstimateLocDTO addEstimateLoc(@RequestBody EstimateLocDTO estimateLocDTO) {
        return estimateLocService.addEstimateLoc(estimateLocDTO);
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
    @PostMapping("/addFunctionType")
    public FunctionTypeDTO addFunctionType(@RequestBody FunctionTypeDTO functionTypeDTO) {
        return estimateLocService.addFunctionType(functionTypeDTO);
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
    @PostMapping("/addTechnology")
    public TechnologyDTO addTechnology(@RequestBody TechnologyDTO technologyDTO) {
        return estimateLocService.addTechnology(technologyDTO);
    }

    @PutMapping("/toggle-status-technology")
    public ResponseEntity<TechnologyDTO> toggleTechnologyStatus(@RequestBody TechnologyDTO TechnologyDTO) {
        TechnologyDTO updatedTechnology = estimateLocService.toggleTechnologyStatus(TechnologyDTO);
        return ResponseEntity.ok(updatedTechnology);
    }
    @PutMapping("/toggle-status-function-type")
    public ResponseEntity<FunctionTypeDTO> toggleFunctionTypeStatus(@RequestBody FunctionTypeDTO functionTypeDTO) {
        FunctionTypeDTO updatedFunctionType = estimateLocService.toggleFunctionTypeStatus(functionTypeDTO);
        return ResponseEntity.ok(updatedFunctionType);
    }
    @PostMapping("/add-function-estimate-loc")
    public ResponseEntity<FunctionEstimateLocDTO> addFunctionEstimateLoc(@RequestBody FunctionEstimateLocDTO functionEstimateLocDTO) {
        FunctionEstimateLocDTO newFunctionEstimateLocDTO = estimateLocService.addFunctionEstimateLoc(functionEstimateLocDTO);
        return ResponseEntity.ok(newFunctionEstimateLocDTO);
    }
    @GetMapping("/get-function-estimate-loc/{backlogId}")
    public FunctionEstimateLocDTO getFunctionEstimateLoc(@PathVariable Long backlogId) {
        return estimateLocService.findByBacklog(backlogId);

    }
    @RequestMapping(value = "/findNumberOfLocInputByLanguageAndFunction/{technologyId}/{functionTypeId}",method = RequestMethod.GET,produces = "application/json")
    public EstimateLocDTO findNumberOfLocInputByLanguageAndFunction(@PathVariable Long technologyId,@PathVariable Long functionTypeId){
        return estimateLocService.findNumberOfLocInputByLanguageAndFunction(technologyId,functionTypeId);
    }
}
