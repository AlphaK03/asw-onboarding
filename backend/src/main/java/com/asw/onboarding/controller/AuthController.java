package com.asw.onboarding.controller;

import com.asw.onboarding.model.User;
import com.asw.onboarding.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        return authService.login(username, password)
                .map(user -> Map.of(
                        "success", true,
                        "username", user.getUsername(),
                        "roles", user.getRoles()
                ))
                .orElse(Map.of("success", false, "message", "Invalid credentials"));
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

}
