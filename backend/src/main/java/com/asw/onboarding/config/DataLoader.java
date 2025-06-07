package com.asw.onboarding.config;

import com.asw.onboarding.model.Role;
import com.asw.onboarding.model.User;
import com.asw.onboarding.repository.RoleRepository;
import com.asw.onboarding.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @PostConstruct
    public void init() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("ADMIN"));
            roleRepository.save(new Role("EMPLOYEE"));
        }

        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .password("admin123")
                    .roles(Set.of(roleRepository.findById("ADMIN").orElseThrow()))
                    .build();

            User employee = User.builder()
                    .username("employee")
                    .password("emp123")
                    .roles(Set.of(roleRepository.findById("EMPLOYEE").orElseThrow()))
                    .build();

            userRepository.save(admin);
            userRepository.save(employee);
        }
    }
}
