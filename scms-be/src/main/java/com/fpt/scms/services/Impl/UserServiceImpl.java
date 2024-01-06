package com.fpt.scms.services.Impl;

import com.fpt.scms.execption.ResourceNotFoundException;
import com.fpt.scms.model.Enum.AuthProvider;
import com.fpt.scms.model.Enum.Gender;
import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.UserProfileDTO;
import com.fpt.scms.model.dto.UserDTO;
import com.fpt.scms.model.dto.UserUpdateDTO;
import com.fpt.scms.model.entity.*;
import com.fpt.scms.repository.RoleRepository;
import com.fpt.scms.repository.UserRepository;
import com.fpt.scms.services.UserService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;

    ModelMapper modelMapper = new ModelMapper();
    @Override
    public Optional<UserProfileDTO> findByEmail(String email) {
        if (email.isEmpty()){
            throw new IllegalArgumentException("Email can't not be null");
        }
        return userRepository.findByEmail(email)
                .map(this::mapToDTOForProfile);
    }
    @Override
    public UserProfileDTO updateUser(Long userId, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ", "id", userId));
        if (userUpdateDTO.getFullName().isEmpty()){
            throw new IllegalArgumentException("Full name can not be null");
        }
        user.setFullName(userUpdateDTO.getFullName());
        user.setGender(Gender.valueOf((userUpdateDTO.getGender())));
        user.setDateOfBirth(userUpdateDTO.getDateOfBirth());
        user.setPhoneNumber(userUpdateDTO.getPhoneNumber());
        user.setFacebookLink(userUpdateDTO.getFacebookLink());
        user.setGitlabToken(userUpdateDTO.getGitlabToken());
        userRepository.save(user);
        return modelMapper.map(user, UserProfileDTO.class);
    }

    @Override
    public Page<UserDTO> getAllUser(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.searchByNameOrEmail(keyword, pageable)
                .map(this::mapToDTO);
    }

    @Override
    public void updateUserRoles(UserDTO userResponseDTO, List<String> roleNames) {
        User user = userRepository.findById(userResponseDTO.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Set<Role> newRoles = roleRepository.findByRoleNameIn(roleNames);
        user.setRoles(newRoles);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateUserStatus(UserDTO userResponseDTO, String status) {
        User user = userRepository.findById(userResponseDTO.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        if (status == null){
            throw  new RuntimeException("Status cant not be null");
        }
        status = String.valueOf(userResponseDTO.getStatus());
        user.setStatus( Status.valueOf(status));
        userRepository.save(user);
    }


    private UserDTO mapToDTO(User user) {
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList());

        return new UserDTO(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarImage(),
                user.getStatus(),
                user.getRollNumber(),
                roleNames
        );
    }
    private UserProfileDTO mapToDTOForProfile(User user) {
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList());

        return new UserProfileDTO(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarImage(),
                roleNames,
                user.getRollNumber(),
                user.getGender(),
                user.getDateOfBirth(),
                user.getPhoneNumber(),
                user.getFacebookLink(),
                user.getGitlabToken()


        );
    }
    public User createUserForImport(String rollNumber, String studentName, String email) {
        User existingUser = userRepository.findUserByEmail(email);
        if (existingUser != null) {
            return existingUser;
        } else {
            User newUser = new User();
            newUser.setRollNumber(rollNumber);
            newUser.setFullName(studentName);
            newUser.setEmail(email);
            newUser.setProvider(AuthProvider.google);
            newUser.setStatus(Status.ACTIVE);
            List<String> roleNames =new ArrayList<>();
            roleNames.add("STUDENT");
            Set<Role> newRoles = roleRepository.findByRoleNameIn(roleNames);
            newUser.setRoles(newRoles);
            userRepository.save(newUser);
            return newUser;
        }
    }


    @Override
    public List<String> importTeachersFromExcel(MultipartFile file) {
        List<String> feedbackMessages = new ArrayList<>();
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            // Check header
            if (rows.hasNext()) {
                Row headerRow = rows.next();
                String header1 = StringUtils.isEmpty(headerRow.getCell(0)) ? "" : headerRow.getCell(0).getStringCellValue();
                String header2 = StringUtils.isEmpty(headerRow.getCell(1)) ? "" : headerRow.getCell(1).getStringCellValue();
                String header3 = StringUtils.isEmpty(headerRow.getCell(2)) ? "" : headerRow.getCell(2).getStringCellValue();

                if (!(header1.equalsIgnoreCase("Name") && header2.equalsIgnoreCase("Email") && header3.equalsIgnoreCase("Phone"))) {
                    throw new RuntimeException("Your file is in the wrong format");
                }
            }

            Role teacherRole = roleRepository.findRoleByRoleName("TEACHER")
                    .orElseThrow(() -> new RuntimeException("Teacher role not found"));
            Role reviewerRole = roleRepository.findRoleByRoleName("REVIEWER")
                    .orElseThrow(() -> new RuntimeException("Reviewer role not found"));
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                String name = currentRow.getCell(0).getStringCellValue();
                String email = currentRow.getCell(1).getStringCellValue();
                String phone = currentRow.getCell(2) != null ? currentRow.getCell(2).getStringCellValue() : "";

                // Check if email already exists
                if (StringUtils.hasText(email) && userRepository.findByEmail(email).isPresent()) {
                    feedbackMessages.add("The email \"" + email + "\" already exists.");
                } else {
                    // Proceed to create a  new teacher user
                    User newUser = new User();
                    newUser.setFullName(name);
                    newUser.setEmail(email);
                    newUser.setPhoneNumber(phone);
                    newUser.setRoles(new HashSet<>(Arrays.asList(teacherRole, reviewerRole)));
                    newUser.setStatus(Status.ACTIVE);
                    newUser.setProvider(AuthProvider.google);
                    userRepository.save(newUser);
                    feedbackMessages.add("Added teacher: " + name + " (" + email + ")");
                }
            }
        } catch (Exception ignored) {

        }

        return feedbackMessages;
    }

    @Override
    public List<Map<String, Object>> getUserEnrollmentData() {
        return userRepository.countUsersGroupedByDate();
    }

}
