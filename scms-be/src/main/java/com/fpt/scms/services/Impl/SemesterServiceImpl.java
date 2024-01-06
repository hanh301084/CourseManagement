package com.fpt.scms.services.Impl;

import com.fpt.scms.execption.ResourceNotFoundException;
import com.fpt.scms.model.Enum.Setting;
import com.fpt.scms.model.dto.SemesterResponseDTO;
import com.fpt.scms.model.dto.SettingDTO;
import com.fpt.scms.model.entity.EvaluationCriteria;
import com.fpt.scms.model.entity.Semester;
import com.fpt.scms.repository.EvaluationCriteriaRepository;
import com.fpt.scms.repository.SemesterRepository;
import com.fpt.scms.repository.SettingRepository;
import com.fpt.scms.services.SemesterService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.fpt.scms.services.SettingService;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SemesterServiceImpl implements SemesterService {

    @Autowired
    private SemesterRepository semesterRepository;
    @Autowired
    private SettingService settingService;
    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    private SettingRepository settingRepository;
    private final ModelMapper modelMapper = new ModelMapper();

    @Override
    public Page<SemesterResponseDTO> getAllSemester(int page, int size, String keyword , Integer year) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Semester> semestersPage = semesterRepository.searchByNameAndYear(keyword, year, pageable);
        return semestersPage.map(semester -> modelMapper.map(semester, SemesterResponseDTO.class));
    }

    @Override
    public SemesterResponseDTO createSemester(SemesterResponseDTO semesterDTO) {
        Optional<Semester> semesterExist = semesterRepository.findBySemesterName(semesterDTO.getSemesterName());
        if (semesterExist.isPresent()){
            throw new RuntimeException("Semester "+ semesterDTO.getSemesterName() +" already existed!");
        }
        semesterDTO.setStatus("ACTIVE");
        Semester semester = modelMapper.map(semesterDTO, Semester.class);
        Semester savedSemester = semesterRepository.save(semester);
        Long semesterId = savedSemester.getSemesterId();
        String b10SettingValue = settingRepository.findSettingValueBySettingType( Setting.ITERATION_BLOCK10);
        if(b10SettingValue != null) {
            SettingDTO settingIterForClassBlock10 = new SettingDTO();
            settingIterForClassBlock10.setTypeId(semesterId);
            settingIterForClassBlock10.setSettingTitle(Setting.ITERATION_BLOCK10);
            settingIterForClassBlock10.setSettingValue(b10SettingValue);
            settingService.createClassSetting(settingIterForClassBlock10, semester.getSemesterId());
        }
        else {
            SettingDTO settingIterForClassBlock10 = new SettingDTO();
            settingIterForClassBlock10.setTypeId(semesterId);
            settingIterForClassBlock10.setSettingTitle(Setting.ITERATION_BLOCK10);
            settingIterForClassBlock10.setSettingValue("3");
            settingService.createClassSetting(settingIterForClassBlock10, semester.getSemesterId());
        }
        List<EvaluationCriteria> latestEvaluationCriterias = evaluationCriteriaRepository.findAllByLastSemester();
        if (latestEvaluationCriterias != null && !latestEvaluationCriterias.isEmpty()) {
            List<EvaluationCriteria> newEvaluationCriterias = new ArrayList<>();
            for (EvaluationCriteria criteria : latestEvaluationCriterias) {
                EvaluationCriteria newCriteria = new EvaluationCriteria();
                copyProperties(criteria, newCriteria);
                newCriteria.setSemester(savedSemester);
                evaluationCriteriaRepository.save(newCriteria);
                newEvaluationCriterias.add(newCriteria);
            }
        }
        String b5SettingValue = settingRepository.findSettingValueBySettingType(Setting.ITERATION_BLOCK5);
        if(b5SettingValue != null) {
            SettingDTO settingIterForClassBlock5 = new SettingDTO();
            settingIterForClassBlock5.setTypeId(semesterId);
            settingIterForClassBlock5.setSettingTitle(Setting.ITERATION_BLOCK5);
            settingIterForClassBlock5.setSettingValue(b5SettingValue);
            settingService.createClassSetting(settingIterForClassBlock5, semester.getSemesterId());
        }
        else {
            SettingDTO settingIterForClassBlock5 = new SettingDTO();
            settingIterForClassBlock5.setTypeId(semesterId);
            settingIterForClassBlock5.setSettingTitle(Setting.ITERATION_BLOCK5);
            settingIterForClassBlock5.setSettingValue("3");
            settingService.createClassSetting(settingIterForClassBlock5, semester.getSemesterId());
        }
        return modelMapper.map(savedSemester, SemesterResponseDTO.class);
    }

    private void copyProperties(EvaluationCriteria source, EvaluationCriteria target) {
        target.setSemester(source.getSemester());
        target.setIteration(source.getIteration());
        target.setClassType(source.getClassType());
        target.setEvaluationWeight(source.getEvaluationWeight());
        target.setOngoingSRSWeight(source.getOngoingSRSWeight());
        target.setOngoingSDSWeight(source.getOngoingSDSWeight());
        target.setOngoingCodingWeight(source.getOngoingCodingWeight());
        target.setMaxLoc(source.getMaxLoc());
        target.setProjectIntroduction(source.getProjectIntroduction());
        target.setProjectImplementation(source.getProjectImplementation());
        target.setFinalSRSWeight(source.getFinalSRSWeight());
        target.setFinalSDSWeight(source.getFinalSDSWeight());
        target.setQAndA(source.getQAndA());
        target.setTeamWorkingWeight(source.getTeamWorkingWeight());
        target.setFinalMaxLoc(source.getFinalMaxLoc());
        target.setTotalOngoingWeight(source.getTotalOngoingWeight());
        target.setFinalWeight(source.getFinalWeight());
        target.setStatus(source.getStatus());
        target.setDescription(source.getDescription());
    }
    @Override
    public SemesterResponseDTO updateSemester(SemesterResponseDTO semesterDTO) {
        Semester semester = semesterRepository.findById(semesterDTO.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester", String.valueOf(semesterDTO.getSemesterId()), ""));
        Optional<Semester> semesterExist = semesterRepository.findBySemesterName(semesterDTO.getSemesterName());
        if (semesterExist.isPresent() && !Objects.equals(semesterDTO.getSemesterName(), semester.getSemesterName())){
            throw new RuntimeException("Semester "+ semesterDTO.getSemesterName() +" already existed!");
        }
        modelMapper.map(semesterDTO, semester);
        Semester updatedSemester = semesterRepository.save(semester);
        return modelMapper.map(updatedSemester, SemesterResponseDTO.class);
    }
    @Override
    public List<String> getAllSemesterYear() {
        List<Integer> years = this.findAllDistinctYears();
        return years.stream().map(String::valueOf).collect(Collectors.toList());
    }
    @Override
    public List<Integer> findAllDistinctYears() {
        List<Integer> startYears = semesterRepository.findAllDistinctStartYears();
        List<Integer> endYears = semesterRepository.findAllDistinctEndYears();
        Set<Integer> combinedYears = new HashSet<>(startYears);
        combinedYears.addAll(endYears);
        List<Integer> sortedYears = new ArrayList<>(combinedYears);
        Collections.sort(sortedYears);
        return sortedYears;
    }
    @Override
    public List<SemesterResponseDTO> getAllSemesterActive(){
        List<Semester> semesters = semesterRepository.findAllActive();
        return semesters.stream()
                .map(semester -> modelMapper.map(semester, SemesterResponseDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public SemesterResponseDTO findCurrentSemester() {
        Semester currentSemester = semesterRepository.findActiveSemester()
                .orElseThrow(() -> new ResourceNotFoundException("Semester", "Current", "No active semester found"));
        return modelMapper.map(currentSemester, SemesterResponseDTO.class);
    }
}
