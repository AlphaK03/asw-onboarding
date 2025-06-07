package com.asw.onboarding.repository;

import com.asw.onboarding.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
}
