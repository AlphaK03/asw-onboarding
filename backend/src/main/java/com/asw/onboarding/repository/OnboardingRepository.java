package com.asw.onboarding.repository;

import com.asw.onboarding.model.Onboarding;
import com.asw.onboarding.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OnboardingRepository extends JpaRepository<Onboarding, Long> {
    List<Onboarding> findByDepartment(Department department);
}
