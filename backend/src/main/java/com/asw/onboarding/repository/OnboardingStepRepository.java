package com.asw.onboarding.repository;

import com.asw.onboarding.model.OnboardingStep;
import com.asw.onboarding.model.Onboarding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OnboardingStepRepository extends JpaRepository<OnboardingStep, Long> {
    List<OnboardingStep> findByOnboardingOrderByOrderNumberAsc(Onboarding onboarding);
}
