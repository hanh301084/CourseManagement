package com.fpt.scms.services.Impl;

import com.fpt.scms.model.dto.MilestoneDTO;
import com.fpt.scms.model.entity.Milestone;
import com.fpt.scms.repository.IterationRepository;
import com.fpt.scms.repository.MilestoneRepository;
import com.fpt.scms.services.MilestoneService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MilestoneServiceImpl implements MilestoneService {
    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private IterationRepository iterationRepository;

    private final ModelMapper modelMapper = new ModelMapper();

    @Override
    public List<MilestoneDTO> getAllMilestone() {
        List<Milestone> milestones = milestoneRepository.findAll();
        return milestones.stream()
                .map(milestone -> modelMapper.map(milestone, MilestoneDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public MilestoneDTO createMilestone(Milestone newMilestone) {
        Milestone milestone= milestoneRepository.save(newMilestone);
        String iterationName = iterationRepository.getIterationNameById(milestone.getIterationId().getIterationId());
        return new MilestoneDTO(milestone.getMilestoneId(), milestone.getMilestoneName(), milestone.getIterationId().getIterationId(), milestone.getClassId().getClassId(), milestone.getFromDate(), milestone.getToDate(), milestone.getStatus(), iterationName);
    }

    @Override
    public MilestoneDTO updateMilestone(MilestoneDTO milestoneDTO) {
        Optional<Milestone> milestoneOptional = milestoneRepository.findById(milestoneDTO.getMilestoneId());
        if (milestoneOptional.isPresent()) {
            Milestone milestone = milestoneOptional.get();
            modelMapper.map(milestoneDTO, milestone);
            Milestone updatedMilestone = milestoneRepository.save(milestone);
            return modelMapper.map(updatedMilestone, MilestoneDTO.class);
        }
        throw new IllegalArgumentException("Milestone not found with ID: " + milestoneDTO.getMilestoneId());
    }

    @Override
    public List<MilestoneDTO> getAllActiveMilestone(long classId) {
        List<Milestone> milestones=milestoneRepository.getAllMilestonesByClassId(classId);
        List<MilestoneDTO> milestoneDTOS=new ArrayList<>();
        for(Milestone milestone: milestones){
            String iterationName=iterationRepository.getIterationNameById(milestone.getIterationId().getIterationId());
            milestoneDTOS.add(new MilestoneDTO(milestone.getMilestoneId(), milestone.getMilestoneName(), milestone.getIterationId().getIterationId(),milestone.getClassId().getClassId(),milestone.getFromDate(),milestone.getToDate(), milestone.getStatus(),iterationName));
        }
        return milestoneDTOS;
    }

    @Override
    public MilestoneDTO getMilestoneByClassId(long classId) {
        Milestone milestone=milestoneRepository.getMilestoneByClassId(classId);
        if(milestone==null){
            milestone=milestoneRepository.getMilestoneNearest(classId);
        }
        if(milestone !=null) {
            String iterationName = iterationRepository.getIterationNameById(milestone.getIterationId().getIterationId());
            return new MilestoneDTO(milestone.getMilestoneId(), milestone.getMilestoneName(), milestone.getIterationId().getIterationId(), milestone.getClassId().getClassId(), milestone.getFromDate(), milestone.getToDate(), milestone.getStatus(), iterationName);
        }
        return null;
    }
}
