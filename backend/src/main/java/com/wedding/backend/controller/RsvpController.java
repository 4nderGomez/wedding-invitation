package com.wedding.backend.controller;

import com.wedding.backend.entity.Rsvp;
import com.wedding.backend.repository.RsvpRepository;
import com.wedding.backend.service.RsvpService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/rsvp")
@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})

public class RsvpController {
    private final RsvpService rsvpService;

    @Autowired
    private RsvpRepository rsvpRepository;

    RsvpController(RsvpService rsvpService, RsvpRepository rsvpRepository) {
        this.rsvpService = rsvpService;
        this.rsvpRepository = rsvpRepository;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Rsvp rsvp) {
        try {
            Rsvp saved = rsvpService.saveRsvp(rsvp);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Rsvp> getAll() {
        return rsvpRepository.findAll();
    }
}