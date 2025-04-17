package com.asw.onboarding.service;

import com.asw.onboarding.model.Department;
import com.asw.onboarding.model.Onboarding;
import com.asw.onboarding.repository.OnboardingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OnboardingService {

    private final OnboardingRepository repository;

    public OnboardingService(OnboardingRepository repository) {
        this.repository = repository;
    }

    public List<Onboarding> getAll() {
        return repository.findAll();
    }

    public Optional<Onboarding> getById(Long id) {
        return repository.findById(id);
    }

    public List<Onboarding> getByDepartment(Department department) {
        return repository.findByDepartment(department);
    }

    public Onboarding create(Onboarding onboarding) {
        return repository.save(onboarding);
    }

    public Onboarding update(Long id, Onboarding updated) {
        return repository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setDepartment(updated.getDepartment());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Onboarding not found"));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }


}
