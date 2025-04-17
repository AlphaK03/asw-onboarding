package com.asw.onboarding.service;

import com.asw.onboarding.model.Onboarding;
import com.asw.onboarding.model.OnboardingStep;
import com.asw.onboarding.repository.OnboardingStepRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OnboardingStepService {

    private final OnboardingStepRepository repository;

    public OnboardingStepService(OnboardingStepRepository repository) {
        this.repository = repository;
    }

    public List<OnboardingStep> getAll() {
        return repository.findAll();
    }

    public Optional<OnboardingStep> getById(Long id) {
        return repository.findById(id);
    }

    public List<OnboardingStep> getByOnboarding(Onboarding onboarding) {
        return repository.findByOnboardingOrderByOrderNumberAsc(onboarding);
    }

    public OnboardingStep create(OnboardingStep step) {
        return repository.save(step);
    }

    public OnboardingStep update(Long id, OnboardingStep updated) {
        return repository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setContent(updated.getContent());
            existing.setOrderNumber(updated.getOrderNumber());
            existing.setOnboarding(updated.getOnboarding());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Step not found"));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
