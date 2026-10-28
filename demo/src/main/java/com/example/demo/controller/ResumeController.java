package com.example.demo.controller;

import com.example.demo.model.Resume;
import com.example.demo.repository.ResumeRepository;
import com.example.demo.service.AtsScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeRepository resumeRepository;
    private final AtsScoringService atsScoringService;

    public ResumeController(ResumeRepository resumeRepository, AtsScoringService atsScoringService) {
        this.resumeRepository = resumeRepository;
        this.atsScoringService = atsScoringService;
    }

    @GetMapping("/user/{userId}")
    public List<Resume> getUserResumes(@PathVariable Long userId) {
        return resumeRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    @PostMapping
    public ResponseEntity<Resume> saveOrUpdateResume(@RequestBody Resume resume) {
        Map<String, Object> evaluation = atsScoringService.evaluateResume(resume);
        resume.setAtsScore((Integer) evaluation.get("score"));
        resume.setWorthinessVerdict((String) evaluation.get("verdict"));
        Resume saved = resumeRepository.save(resume);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, Object>> evaluateResumeWorthiness(@RequestBody Resume resume) {
        return ResponseEntity.ok(atsScoringService.evaluateResume(resume));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id) {
        resumeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}