package ma.marocsphere.controller;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ExperienceCreationDTO;
import ma.marocsphere.dto.ExperienceResponseDTO;
import ma.marocsphere.service.ExperienceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping("/guide/me")
    public ResponseEntity<List<ExperienceResponseDTO>> getMyExperiences() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long guideId = experienceService.getGuideIdByEmail(email);
        return ResponseEntity.ok(experienceService.getByGuideId(guideId));
    }

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<ExperienceResponseDTO>> getByGuideId(@PathVariable Long guideId) {
        return ResponseEntity.ok(experienceService.getByGuideId(guideId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExperienceResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(experienceService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ExperienceResponseDTO> create(@RequestBody ExperienceCreationDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long guideId = experienceService.getGuideIdByEmail(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(experienceService.create(guideId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExperienceResponseDTO> update(@PathVariable Long id, @RequestBody ExperienceCreationDTO dto) {
        return ResponseEntity.ok(experienceService.update(id, dto));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ExperienceResponseDTO> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(experienceService.toggleStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        experienceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
