package com.fpt.scms.services;

import com.fpt.scms.model.dto.UserProfileDTO;
import com.fpt.scms.model.dto.UserDTO;
import com.fpt.scms.model.dto.UserUpdateDTO;
import com.fpt.scms.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserService {
    Optional<UserProfileDTO> findByEmail(String email);
    UserProfileDTO  updateUser(Long userId, UserUpdateDTO userUpdateDTO);
    Page<UserDTO> getAllUser(int page, int size, String keyword);
    void updateUserRoles(UserDTO userResponseDTO, List<String> roleNames) ;
    void updateUserStatus(UserDTO userResponseDTO, String status);
    User createUserForImport(String rollNumber,String studentName,String email);
    List<String> importTeachersFromExcel(MultipartFile file);
    List<Map<String, Object>> getUserEnrollmentData();
}
