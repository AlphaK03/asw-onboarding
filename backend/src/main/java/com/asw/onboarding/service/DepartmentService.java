package com.asw.onboarding.service;
import java.util.Optional;

import com.asw.onboarding.model.Department;
import com.asw.onboarding.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository repository;

    public DepartmentService(DepartmentRepository repository) {
        this.repository = repository;
    }

    public List<Department> getAll() {
        return repository.findAll();
    }

    public Department create(Department department) {
        return repository.save(department);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Department update(Long id, Department updatedDepartment) {
        Department existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        existing.setName(updatedDepartment.getName());
        return repository.save(existing);
    }

    public Optional<Department> getById(Long id) {
        return repository.findById(id);
    }


}
