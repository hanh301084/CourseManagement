package com.fpt.scms.security.oauth2;


import com.fpt.scms.execption.OAuth2AuthenticationProcessingException;
import com.fpt.scms.model.Enum.AuthProvider;
import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.RoleResponseDTO;
import com.fpt.scms.model.entity.Role;
import com.fpt.scms.model.entity.User;
import com.fpt.scms.repository.UserRepository;
import com.fpt.scms.security.UserPrincipal;
import com.fpt.scms.security.oauth2.user.OAuth2UserInfo;
import com.fpt.scms.security.oauth2.user.OAuth2UserInfoFactory;
import com.fpt.scms.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleService roleService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        if (StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProvider().equals(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getProvider() + " account. Please use your " + user.getProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            try {
                user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
            } catch (OAuth2AuthenticationProcessingException e) {
                throw e;
            }
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();

        String userEmail = oAuth2UserInfo.getEmail();
        String[] splitEmail = userEmail.split("@");

        // Kiểm tra xem email có thuộc domain "fpt.edu.vn" hoặc "fe.edu.vn" không
        if (splitEmail[1].equalsIgnoreCase("fpt.edu.vn") || splitEmail[1].equalsIgnoreCase("fe.edu.vn")) {
            // Kiểm tra xem email có phải của giáo viên không
            if (userEmail.matches("^[a-zA-Z]+(\\d{1,4})?@fpt\\.edu\\.vn$") || userEmail.matches("^[a-zA-Z]+(\\d{1,4})?@fe\\.edu\\.vn$")) {
                // Gán quyền "TEACHER" cho người dùng
                RoleResponseDTO teacherRoleDto = roleService.getAllRole().stream()
                        .filter(role -> role.getRoleName().equalsIgnoreCase("TEACHER"))
                        .findFirst()
                        .orElseThrow(() -> new OAuth2AuthenticationProcessingException("Don't have TEACHER ROLE"));

                Role teacherRole = new Role();
                teacherRole.setRoleId(teacherRoleDto.getRoleId());
                teacherRole.setRoleName(teacherRoleDto.getRoleName());

                user.getRoles().add(teacherRole);
            } else {
                // Lấy 2 ký tự trước số đầu tiên và các số từ email
                String rollNumber = userEmail.substring(0, userEmail.indexOf(splitEmail[1]) - 1);
                Matcher m = Pattern.compile("([a-zA-Z]{2})(\\d+)").matcher(rollNumber);
                if (m.find()) {
                    rollNumber = m.group(1).toUpperCase() + m.group(2);
                }
                user.setRollNumber(rollNumber);

                // Gán quyền "STUDENT" cho người dùng
                RoleResponseDTO studentRoleDto = roleService.getAllRole().stream()
                        .filter(role -> role.getRoleName().equalsIgnoreCase("STUDENT"))
                        .findFirst()
                        .orElseThrow(() -> new OAuth2AuthenticationProcessingException("Dont have Student Role"));

                Role studentRole = new Role();
                studentRole.setRoleId(studentRoleDto.getRoleId());
                studentRole.setRoleName(studentRoleDto.getRoleName());

                user.getRoles().add(studentRole);
            }
        } else {
            throw new OAuth2AuthenticationProcessingException("Your email is not allowed!");
        }

        user.setProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setProviderId(oAuth2UserInfo.getId());
        String emailName =oAuth2UserInfo.getName();
        if (emailName.contains("(")){
            String[] parts = emailName.split("\\(");
        user.setFullName(parts[0]);

        }else{
            user.setFullName(oAuth2UserInfo.getName());
        }
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setAvatarImage(oAuth2UserInfo.getImageUrl());
        user.setStatus(Status.ACTIVE);

        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setAvatarImage(oAuth2UserInfo.getImageUrl());
        return userRepository.save(existingUser);
    }

}
