package com.asw.onboarding.controller;

import com.asw.onboarding.model.Department;
import com.asw.onboarding.model.Onboarding;
import com.asw.onboarding.service.DepartmentService;
import com.asw.onboarding.service.OnboardingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/onboardings")
@CrossOrigin(origins = "http://localhost:5173")
public class OnboardingController {

    private final OnboardingService onboardingService;
    private final DepartmentService departmentService;

    public OnboardingController(OnboardingService onboardingService, DepartmentService departmentService) {
        this.onboardingService = onboardingService;
        this.departmentService = departmentService;
    }

    @GetMapping
    public List<Onboarding> getAll() {
        return onboardingService.getAll();
    }

    @GetMapping("/by-department/{departmentId}")
    public List<Onboarding> getByDepartment(@PathVariable Long departmentId) {
        Department dept = departmentService.getById(departmentId).orElseThrow();
        return onboardingService.getByDepartment(dept);
    }

    @PostMapping
    public Onboarding create(@RequestBody Onboarding onboarding) {
        return onboardingService.create(onboarding);
    }

    @PutMapping("/{id}")
    public Onboarding update(@PathVariable Long id, @RequestBody Onboarding updated) {
        return onboardingService.update(id, updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        onboardingService.delete(id);
    }

    @GetMapping("/{id}")
    public Onboarding getById(@PathVariable Long id) {
        return onboardingService.getById(id).orElseThrow();
    }

}
