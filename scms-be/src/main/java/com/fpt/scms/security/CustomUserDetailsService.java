package com.fpt.scms.security;


import com.fpt.scms.execption.ResourceNotFoundException;
import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.entity.User;
import com.fpt.scms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email : " + email)
                );

        if (user.getStatus() == Status.INACTIVE) {
            throw new UsernameNotFoundException("Sorry! You had been blocked!.");
        }

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User", "id", id)
        );

        if (user.getStatus() == Status.INACTIVE) {
            throw new RuntimeException("Sorry! You had been blocked!.");
        }

        return UserPrincipal.create(user);
    }
}