package ma.marocsphere.controller;

import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;
import ma.marocsphere.dto.GuideUpdateDTO;
import ma.marocsphere.service.GuideService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guides")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping
    public ResponseEntity<List<GuideResponseDTO>> getAll() {
        return ResponseEntity.ok(guideService.getAll());
    }

    @GetMapping("/me")
    public ResponseEntity<GuideResponseDTO> getMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        GuideResponseDTO response = guideService.getByEmail(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuideResponseDTO> getById(@PathVariable Long id) {
        GuideResponseDTO response = guideService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<GuideResponseDTO> create(@RequestBody GuideCreationDTO dto) {
        GuideResponseDTO response = guideService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuideResponseDTO> update(@PathVariable Long id, @RequestBody GuideUpdateDTO dto) {
        GuideResponseDTO response = guideService.update(id, dto);
        return ResponseEntity.ok(response);
    }
}
