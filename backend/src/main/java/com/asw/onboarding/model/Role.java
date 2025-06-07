package com.asw.onboarding.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    private String name; // e.g. "ADMIN", "EMPLOYEE"
}
