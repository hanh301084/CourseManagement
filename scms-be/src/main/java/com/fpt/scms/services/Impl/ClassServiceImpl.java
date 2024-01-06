package com.fpt.scms.services.Impl;

import com.fpt.scms.model.Enum.IsBlock5;
import com.fpt.scms.model.dto.ClassResponseDTO;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.model.dto.ClassDTO;
import com.fpt.scms.model.entity.User;
import com.fpt.scms.repository.ClassRepository;
import com.fpt.scms.repository.SemesterRepository;
import com.fpt.scms.repository.UserRepository;
import com.fpt.scms.security.UserPrincipal;
import com.fpt.scms.services.ClassService;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassServiceImpl implements ClassService {
    private final ClassRepository classRepository;
    private final UserRepository userRepository;
    private final SemesterRepository semesterRepository;

    ModelMapper modelMapper = new ModelMapper();

    public ClassServiceImpl(ClassRepository classRepository, UserRepository userRepository, SemesterRepository semesterRepository) {
        this.classRepository = classRepository;
        this.userRepository = userRepository;
        this.semesterRepository = semesterRepository;
    }

    @Override
    public List<ClassResponseDTO> getAllClasses() {
        return classRepository.findAll()
                .stream()
                .map(classEntity -> modelMapper.map(classEntity, ClassResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ClassResponseDTO createClass(ClassDTO request, Long userId) {
        Class savedClass = new Class();
        savedClass.setClassCode(request.getClassCode());
        IsBlock5 isBlock5 = IsBlock5.valueOf(request.getIsBlock5());
        savedClass.setIsBlock5(isBlock5);
        try {
            User trainer = userRepository.findById(request.getTrainerId()).orElse(null);
            if (trainer == null) {
                throw new RuntimeException("trainer not found");
            }
            savedClass.setTrainer(trainer);
        }catch (Exception e){
            System.out.println(e);
        }

        if (request.getReviewers() != null) {
            List<User> reviewers = userRepository.findAllById(request.getReviewers());
            savedClass.setReviewer1(reviewers.size() > 0 ? reviewers.get(0) : null);
            savedClass.setReviewer2(reviewers.size() > 1 ? reviewers.get(1) : null);
            savedClass.setReviewer3(reviewers.size() > 2 ? reviewers.get(2) : null);
            savedClass.setReviewer4(reviewers.size() > 3 ? reviewers.get(3) : null);
        }
        if (request.getReviewerResits() != null) {
            List<User> reviewerResits = userRepository.findAllById(request.getReviewerResits());
            savedClass.setReviewerResit1(reviewerResits.size() > 0 ? reviewerResits.get(0) : null);
            savedClass.setReviewerResit2(reviewerResits.size() > 1 ? reviewerResits.get(1) : null);
            savedClass.setReviewerResit3(reviewerResits.size() > 2 ? reviewerResits.get(2) : null);
            savedClass.setReviewerResit4(reviewerResits.size() > 3 ? reviewerResits.get(3) : null);
        }

        if (request.getSemesterId() != null) {
            var semester = semesterRepository.findById(request.getSemesterId()).orElse(null);
            if (semester == null) {
                throw new RuntimeException("semester not found");
            }
            savedClass.setSemester(semester);
        }
        var currentUser = userRepository.findById(userId).orElse(null);
        if (currentUser == null) {
            throw new RuntimeException("Current User not found");
        }
        savedClass.setStatus("ACTIVE");
        savedClass.setCreatedBy(currentUser);
        savedClass.setUpdatedBy(currentUser);
        classRepository.save(savedClass);
        return modelMapper.map(savedClass, ClassResponseDTO.class);
    }

    @Override
    public ClassResponseDTO updateClass(ClassDTO request, Long userId) {
        if (request.getClassId() == null) {
            throw new RuntimeException("Class id must not be null");
        }
        Class savedClass = classRepository.findById(request.getClassId()).orElseThrow(() -> new RuntimeException("Class not found"));
        savedClass.setClassCode(request.getClassCode());
        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+request.getIsBlock5());
        IsBlock5 isBlock5 = IsBlock5.valueOf(request.getIsBlock5());
        savedClass.setIsBlock5(isBlock5);


        var trainer = userRepository.findById(request.getTrainerId()).orElse(null);
        if (trainer == null) {
            throw new RuntimeException("trainer not found");
        }
        savedClass.setTrainer(trainer); // Add this line
        if (request.getReviewers() != null) {
            List<User> reviewers = userRepository.findAllById(request.getReviewers());
            savedClass.setReviewer1(reviewers.size() > 0 ? reviewers.get(0) : null);
            savedClass.setReviewer2(reviewers.size() > 1 ? reviewers.get(1) : null);
            savedClass.setReviewer3(reviewers.size() > 2 ? reviewers.get(2) : null);
            savedClass.setReviewer4(reviewers.size() > 3 ? reviewers.get(3) : null);
        }
        if (request.getReviewerResits() != null) {
            List<User> reviewerResits = userRepository.findAllById(request.getReviewerResits());
            savedClass.setReviewerResit1(reviewerResits.size() > 0 ? reviewerResits.get(0) : null);
            savedClass.setReviewerResit2(reviewerResits.size() > 1 ? reviewerResits.get(1) : null);
            savedClass.setReviewerResit3(reviewerResits.size() > 2 ? reviewerResits.get(2) : null);
            savedClass.setReviewerResit4(reviewerResits.size() > 3 ? reviewerResits.get(3) : null);
        }

        if (request.getSemesterId() != null) {
            var semester = semesterRepository.findById(request.getSemesterId()).orElse(null);
            if (semester == null) {
                throw new RuntimeException("trainer not found");
            }
            savedClass.setSemester(semester);
        }
        var currentUser = userRepository.findById(userId).orElse(null);
        if (currentUser == null) {
            throw new RuntimeException("trainer not found");
        }

        if (request.getStatus() != null)
            savedClass.setStatus(request.getStatus());

        savedClass.setUpdatedBy(currentUser);
        classRepository.save(savedClass);
        Class updatedClass = classRepository.save(savedClass);
        return modelMapper.map(updatedClass, ClassResponseDTO.class);
    }
    @Override
    public List<ClassResponseDTO> getAllClassesByTrainer(Long id, Long semesterId) {
        if(semesterId == 0L) {
            return classRepository.findAllByTrainerId(id)
                    .stream()
                    .map(classEntity -> modelMapper.map(classEntity, ClassResponseDTO.class))
                    .collect(Collectors.toList());
        }
        else {
            return classRepository.findAllByTrainerAndSemester(id, semesterId)
                    .stream()
                    .map(classEntity -> modelMapper.map(classEntity, ClassResponseDTO.class))
                    .collect(Collectors.toList());
        }
    }


    @Override
    public List<ClassResponseDTO> getAllClassesBySemester(Long semesterId, String status) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        return classRepository.findBySemester_SemesterIdAndStatusAndTrainer(semesterId, "ACTIVE",currentUser)
                .stream()
                .map(classEntity -> modelMapper.map(classEntity, ClassResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassResponseDTO> getAllClassesBySemesterForReviewer(Long semesterId, String status) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        return classRepository.findBySemesterAndStatusAndReviewer(semesterId, "ACTIVE",currentUser)
                .stream()
                .map(classEntity -> modelMapper.map(classEntity, ClassResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassResponseDTO> getAllClassesByReviewer(Long id, Long semesterId) {
        if(semesterId == 0L) {
            return classRepository.findAllByReviewerId(id)
                    .stream()
                    .map(classEntity -> modelMapper.map(classEntity, ClassResponseDTO.class))
                    .collect(Collectors.toList());
        }
        else {
            return classRepository.findAllByReviewerAndSemester(id, semesterId)
                    .stream()
                    .map(classEntity -> modelMapper.map(classEntity, ClassResponseDTO.class))
                    .collect(Collectors.toList());
        }
    }


    @Override
    public ClassResponseDTO getDetailClass(Long id) {
        var cl = classRepository.findById(id).orElseThrow(() ->
                new UsernameNotFoundException("Class not found with id : " + id));
        return modelMapper.map(cl,ClassResponseDTO.class) ;
    }

}
