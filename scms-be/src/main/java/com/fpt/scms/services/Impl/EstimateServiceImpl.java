package com.fpt.scms.services.Impl;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.*;
import com.fpt.scms.model.entity.*;
import com.fpt.scms.repository.EstimateLocRepository;
import com.fpt.scms.repository.FunctionEstimateLocRepository;
import com.fpt.scms.repository.FunctionTypeRepository;
import com.fpt.scms.repository.TechnologyRepository;
import com.fpt.scms.services.EstimateLocService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EstimateServiceImpl implements EstimateLocService {
    @Autowired
    private EstimateLocRepository estimateLocRepository;

    @Autowired
    FunctionEstimateLocRepository functionEstimateLocRepository;
    @Autowired
    private FunctionTypeRepository functionTypeRepository;

    @Autowired
    private TechnologyRepository technologyRepository;
    private final ModelMapper modelMapper = new ModelMapper();

    @Override
    public List<FunctionTypeDTO> getAllFunctionTypes() {
        List<FunctionType> functionTypes = functionTypeRepository.findAll();

        return functionTypes.stream()
                .map(functionType -> modelMapper.map(functionType, FunctionTypeDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<TechnologyDTO> getAllTechnology() {
        List<Technology> technologies = technologyRepository.findAll();

        return technologies.stream().map(technology -> modelMapper.map(technology, TechnologyDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<EstimateLocDTO> getAllEstimateLoc() {
        List<EstimateLoc> estimateLocs = estimateLocRepository.findAll();
        return estimateLocs.stream().map(estimateLoc -> modelMapper.map(estimateLoc, EstimateLocDTO.class)).collect(Collectors.toList());
    }

    @Override
    public List<FunctionEstimateLocDTO> getAllFunctionEstimateLoc() {
        List<FunctionEstimateLoc> functionEstimateLocs = functionEstimateLocRepository.findAll();
        return  functionEstimateLocs.stream().map(functionEstimateLoc -> modelMapper.map(functionEstimateLoc, FunctionEstimateLocDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<FunctionTypeDTO> getAllFunctionTypesActive() {
        List<FunctionType> functionTypes = functionTypeRepository.findAllByStatus(Status.ACTIVE);

        return functionTypes.stream()
                .map(functionType -> modelMapper.map(functionType, FunctionTypeDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<TechnologyDTO> getAllTechnologyActive() {
        List<Technology> technologies = technologyRepository.findAllByStatus(Status.ACTIVE);

        return technologies.stream().map(technology -> modelMapper.map(technology, TechnologyDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EstimateLocDTO addEstimateLoc(EstimateLocDTO estimateLocDTO) {
        EstimateLoc estimateLoc = modelMapper.map(estimateLocDTO, EstimateLoc.class);

        // Ensure function type and technology are not null
        if (estimateLoc.getFunctionType() == null || estimateLoc.getTechnology() == null) {
            throw new IllegalArgumentException("Function type and technology must not be null");
        }

        EstimateLoc existingEstimateLoc = estimateLocRepository.findEstimateLocByTechnology_IdAndFunctionType_Id(
                estimateLoc.getFunctionType().getId(), estimateLoc.getTechnology().getId());

        if (existingEstimateLoc != null) {
            existingEstimateLoc.setNumberOfLocPerInput(estimateLoc.getNumberOfLocPerInput());
            estimateLoc = existingEstimateLoc;
        } else {
            estimateLoc.setStatus("NOT LOCK"); // Ensure this is the correct status
        }

        EstimateLoc savedEstimateLoc = estimateLocRepository.save(estimateLoc);
        return modelMapper.map(savedEstimateLoc, EstimateLocDTO.class);
    }



    @Override
    public FunctionTypeDTO addFunctionType(FunctionTypeDTO functionTypeDTO) {
        Optional<FunctionType> existFunctionType = functionTypeRepository.findByNameAndStatus(functionTypeDTO.getName(), Status.ACTIVE);
        if (existFunctionType.isPresent()) {
            throw new IllegalArgumentException(functionTypeDTO.getName() + " already existed! Please De-active exist then create new   ");
        }
        FunctionType functionType = modelMapper.map(functionTypeDTO, FunctionType.class);
        functionType.setStatus(Status.ACTIVE);
        FunctionType savedFunctionType = functionTypeRepository.save(functionType);
        return modelMapper.map(savedFunctionType, FunctionTypeDTO.class);
    }


    @Override
    public TechnologyDTO addTechnology(TechnologyDTO technologyDTO) {
        Optional<Technology> existTechnology = technologyRepository.findByNameAndStatus(technologyDTO.getName(), Status.ACTIVE);
        if (existTechnology.isPresent()) {
            throw new IllegalArgumentException(technologyDTO.getName() + " already existed! Please De-active exist then create new   ");
        }
        Technology technology = modelMapper.map(technologyDTO, Technology.class);
        technology.setStatus(Status.ACTIVE);
        Technology savedTechnology = technologyRepository.save(technology);
        return modelMapper.map(savedTechnology, TechnologyDTO.class);
    }

    @Override
    public EstimateLocDTO findNumberOfLocInputByLanguageAndFunction(Long technologyId, Long functionTypeId) {
        EstimateLoc estimateLoc = estimateLocRepository.findEstimateLocByTechnology_IdAndFunctionType_Id(technologyId, functionTypeId);
        return modelMapper.map(estimateLoc, EstimateLocDTO.class);
    }

    @Override
    public FunctionEstimateLocDTO findByBacklog(Long projectBacklogId) {
        FunctionEstimateLoc functionEstimateLoc = functionEstimateLocRepository.findByProjectBacklog_ProjectBacklogId(projectBacklogId);

        if (functionEstimateLoc != null) {
            return modelMapper.map(functionEstimateLoc, FunctionEstimateLocDTO.class);
        } else {
            return null;
        }
    }

    @Override
    public TechnologyDTO toggleTechnologyStatus(TechnologyDTO technologyDTO) {
        Technology technology = technologyRepository.findById(technologyDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Technology not found with id: " + technologyDTO.getId()));

        // Check if trying to activate and a technology with the same name and active status exists
        if (technology.getStatus() == Status.INACTIVE) {
            boolean existsActive = technologyRepository.existsByNameAndStatus(technology.getName(), Status.ACTIVE);
            if (existsActive) {
                throw new IllegalStateException("An active technology with the same name already exists.");
            }
        }
        technology.setStatus(technology.getStatus() == Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE);
        Technology updatedTechnology = technologyRepository.save(technology);
        return modelMapper.map(updatedTechnology, TechnologyDTO.class);
    }


    @Override
    public FunctionTypeDTO toggleFunctionTypeStatus(FunctionTypeDTO functionTypeDTO) {
        FunctionType functionType = functionTypeRepository.findById(functionTypeDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Function Type not found with id: " + functionTypeDTO.getId()));
        // Check if trying to activate and a function type with the same name and active status exists
        if (functionType.getStatus() == Status.INACTIVE) {
            boolean existsActive = functionTypeRepository.existsByNameAndStatus(functionType.getName(), Status.ACTIVE);
            if (existsActive) {
                throw new IllegalStateException("An active function type with the same name already exists.");
            }
        }
        functionType.setStatus(functionType.getStatus() == Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE);
        FunctionType updatedFunctionType = functionTypeRepository.save(functionType);
        return modelMapper.map(updatedFunctionType, FunctionTypeDTO.class);
    }

    @Override
    public FunctionEstimateLocDTO addFunctionEstimateLoc(FunctionEstimateLocDTO dto) {
        Long projectBacklogId = dto.getProjectBacklog().getProjectBacklogId();
        FunctionEstimateLoc existingFunctionEstimateLoc = functionEstimateLocRepository.findByProjectBacklog_ProjectBacklogId(projectBacklogId);
        FunctionEstimateLoc functionEstimateLoc;
        if (existingFunctionEstimateLoc != null) {
            existingFunctionEstimateLoc.setEstimateLoc(dto.getEstimateLoc());
            existingFunctionEstimateLoc.setNumberOfInput(dto.getNumberOfInput());
            functionEstimateLoc = existingFunctionEstimateLoc;
        } else {
            functionEstimateLoc = modelMapper.map(dto, FunctionEstimateLoc.class);
        }
        EstimateLoc estimateLoc = estimateLocRepository.findEstimateLocByTechnology_IdAndFunctionType_Id(
                dto.getEstimateLoc().getTechnology().getId(),dto.getEstimateLoc().getFunctionType().getId());
        estimateLoc.setStatus("LOCKED");
        estimateLocRepository.save(estimateLoc);
        FunctionEstimateLoc savedFunctionEstimateLoc = functionEstimateLocRepository.save(functionEstimateLoc);
        return modelMapper.map(savedFunctionEstimateLoc, FunctionEstimateLocDTO.class);
    }
}
