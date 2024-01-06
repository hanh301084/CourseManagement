package com.fpt.scms.services;

import com.fpt.scms.model.dto.EstimateLocDTO;
import com.fpt.scms.model.dto.FunctionEstimateLocDTO;
import com.fpt.scms.model.dto.FunctionTypeDTO;
import com.fpt.scms.model.dto.TechnologyDTO;
import com.fpt.scms.model.entity.EstimateLoc;
import com.fpt.scms.model.entity.FunctionEstimateLoc;
import com.fpt.scms.model.entity.ProjectBacklog;

import java.util.List;

//
public interface EstimateLocService {
    List<FunctionTypeDTO> getAllFunctionTypes();

    List<TechnologyDTO> getAllTechnology();

    List<EstimateLocDTO> getAllEstimateLoc();
    List<FunctionEstimateLocDTO> getAllFunctionEstimateLoc();

    List<FunctionTypeDTO> getAllFunctionTypesActive();

    List<TechnologyDTO> getAllTechnologyActive();

    EstimateLocDTO addEstimateLoc(EstimateLocDTO estimateLocDTO);

    FunctionTypeDTO addFunctionType(FunctionTypeDTO functionTypeDTO);

    TechnologyDTO addTechnology(TechnologyDTO technologyDTO);

    TechnologyDTO toggleTechnologyStatus(TechnologyDTO technologyDTO);

    FunctionTypeDTO toggleFunctionTypeStatus(FunctionTypeDTO functionTypeDTO);
    FunctionEstimateLocDTO addFunctionEstimateLoc(FunctionEstimateLocDTO dto);

    EstimateLocDTO findNumberOfLocInputByLanguageAndFunction(Long technology, Long functionType);

    FunctionEstimateLocDTO findByBacklog(Long projectBacklogId);

}
