package com.asw.onboarding.service;

import com.asw.onboarding.model.User;
import com.asw.onboarding.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public Optional<User> login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password)); // Solo para prueba (sin encriptar)
    }

    public User register(User user) {
        // ⚠️ Asegurate de validar si ya existe, o encriptar password si lo necesitás
        return userRepository.save(user);
    }

}
