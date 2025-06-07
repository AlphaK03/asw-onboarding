package com.asw.onboarding.controller;

import com.asw.onboarding.model.Onboarding;
import com.asw.onboarding.model.OnboardingStep;
import com.asw.onboarding.service.OnboardingService;
import com.asw.onboarding.service.OnboardingStepService;
import org.springframework.web.bind.annotation.*;
import com.asw.onboarding.repository.OnboardingStepRepository;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.ArrayList;


import java.util.List;

@RestController
@RequestMapping("/api/steps")
@CrossOrigin(origins = "http://localhost:5173")
public class OnboardingStepController {

    private final OnboardingStepService stepService;
    private final OnboardingService onboardingService;
    private final OnboardingStepRepository stepRepository;


    public OnboardingStepController(
        OnboardingStepService stepService,
        OnboardingService onboardingService,
        OnboardingStepRepository stepRepository
    ) {
        this.stepService = stepService;
        this.onboardingService = onboardingService;
        this.stepRepository = stepRepository;
    }


    @GetMapping("/by-onboarding/{onboardingId}")
    public List<OnboardingStep> getByOnboarding(@PathVariable Long onboardingId) {
        Onboarding onboarding = onboardingService.getById(onboardingId).orElseThrow();
        return stepService.getByOnboarding(onboarding);
    }

    @PostMapping
    public OnboardingStep create(@RequestBody OnboardingStep step) {
        return stepService.create(step);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        stepService.delete(id);
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderSteps(@RequestBody List<OnboardingStep> steps) {
        List<OnboardingStep> toSave = new ArrayList<>();

        for (OnboardingStep incoming : steps) {
            OnboardingStep existing = stepRepository.findById(incoming.getId())
                .orElseThrow(() -> new RuntimeException("Step not found"));

            existing.setOrderNumber(incoming.getOrderNumber());
            toSave.add(existing);
        }

        stepRepository.saveAll(toSave);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/{id}")
    public OnboardingStep update(@PathVariable Long id, @RequestBody OnboardingStep updatedStep) {
        return stepService.update(id, updatedStep);
    }
}
