package com.fpt.scms.services.Impl;

import com.fpt.scms.execption.ResourceNotFoundException;
import com.fpt.scms.model.Enum.IsBlock5;
import com.fpt.scms.model.Enum.Setting;
import com.fpt.scms.model.dto.IterationResponseDTO;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.model.entity.Iteration;
import com.fpt.scms.model.entity.Semester;
import com.fpt.scms.repository.ClassRepository;
import com.fpt.scms.repository.IterationRepository;
import com.fpt.scms.repository.SemesterRepository;
import com.fpt.scms.repository.SettingRepository;
import com.fpt.scms.services.IterationService;
import com.fpt.scms.services.SettingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IterationServiceImpl implements IterationService {

    @Autowired
    private IterationRepository iterationRepository;
    @Autowired
    private SettingService settingService;

    @Autowired
    private ClassRepository classRepository;

    @PersistenceContext
    private EntityManager entityManager;
    private final ModelMapper modelMapper = new ModelMapper();

    @Override
    public Page<IterationResponseDTO> getAllIterations(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Iteration> iterationsPage = iterationRepository.searchByName(keyword, pageable);
        return iterationsPage.map(iteration -> modelMapper.map(iteration, IterationResponseDTO.class));
    }

    @Override
    public IterationResponseDTO createIteration(IterationResponseDTO iterationDTO) {
        Iteration iteration = modelMapper.map(iterationDTO, Iteration.class);
        Iteration savedIteration = iterationRepository.save(iteration);
        return modelMapper.map(savedIteration, IterationResponseDTO.class);
    }

    @Override
    public IterationResponseDTO updateIteration(IterationResponseDTO iterationDTO) {
        Iteration iteration = iterationRepository.findById(iterationDTO.getIterationId())
                .orElseThrow(() -> new ResourceNotFoundException("Iteration", String.valueOf(iterationDTO.getIterationId()), ""));
        modelMapper.map(iterationDTO, iteration);
        Iteration updatedIteration = iterationRepository.save(iteration);
        return modelMapper.map(updatedIteration, IterationResponseDTO.class);
    }

    @Override
    public List<IterationResponseDTO> getFirstNActiveIterations(int count) {
        List<Iteration> activeIterations = iterationRepository.findActiveIterations();
        return activeIterations.stream()
                .limit(count) // Limit the number of iterations to count
                .map(iteration -> modelMapper.map(iteration, IterationResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<IterationResponseDTO> getAllIterationActive(Long semesterId, com.fpt.scms.model.Enum.Setting classType) {
        int number = settingService.getNumberIteration(semesterId, classType);
        List<Iteration> allActiveIterations = iterationRepository.findActiveIterations();
        List<Iteration> activeIterations = allActiveIterations.subList(0, Math.min(number, allActiveIterations.size()));
        return activeIterations.stream()
                .map(iteration -> modelMapper.map(iteration, IterationResponseDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public List<IterationResponseDTO> getAllIterationActiveOG(Long semesterId, com.fpt.scms.model.Enum.Setting classType) {
        int number = settingService.getNumberIteration(semesterId, classType) -1;
        List<Iteration> allActiveIterations = iterationRepository.findActiveIterations();
        List<Iteration> activeIterations = allActiveIterations.subList(0, Math.min(number, allActiveIterations.size()));
        return activeIterations.stream()
                .map(iteration -> modelMapper.map(iteration, IterationResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<IterationResponseDTO> getAllIterationBySemesterAndClass(Long semesterId,Long classId) {
        var clazz=classRepository.findById(classId).orElseThrow(() ->
                new UsernameNotFoundException("Class not found with id : " + classId));
        IsBlock5 isBlock5=clazz.getIsBlock5();
        int number;
        if(isBlock5.name().equals("YES")) {
            number = settingService.getNumberIteration(semesterId, Setting.ITERATION_BLOCK5);
        }else{
            number=settingService.getNumberIteration(semesterId,Setting.ITERATION_BLOCK10);
        }
        TypedQuery<Iteration> query = entityManager.createQuery("SELECT i FROM Iteration i WHERE i.status = 'ACTIVE' ORDER BY i.iterationId ASC", Iteration.class);
        query.setMaxResults(number);
        List<Iteration> iterations=query.getResultList();
        List<Iteration> activeIterations = iterations.subList(0, Math.min(number, iterations.size()));
        return activeIterations.stream()
                .map(iteration -> modelMapper.map(iteration, IterationResponseDTO.class))
                .collect(Collectors.toList());
    }
}
