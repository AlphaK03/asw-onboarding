package com.asw.onboarding.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;         // Título del paso
    private String content;       // Contenido explicativo
    private String description;   // Descripción adicional
    private String mediaUrl;      // Enlace multimedia
    private int orderNumber;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "onboarding_id")
    private Onboarding onboarding;
}
