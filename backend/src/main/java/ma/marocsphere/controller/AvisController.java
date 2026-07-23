package ma.marocsphere.controller;

import ma.marocsphere.dto.AvisCreationDTO;
import ma.marocsphere.dto.AvisResponseDTO;
import ma.marocsphere.service.AvisService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avis")
public class AvisController {

    private final AvisService avisService;

    public AvisController(AvisService avisService) {
        this.avisService = avisService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvisResponseDTO> getById(@PathVariable Long id) {
        AvisResponseDTO response = avisService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<AvisResponseDTO>> getByGuideId(@PathVariable Long guideId) {
        return ResponseEntity.ok(avisService.getByGuideId(guideId));
    }

    @GetMapping("/artisan/{artisanId}")
    public ResponseEntity<List<AvisResponseDTO>> getByArtisanId(@PathVariable Long artisanId) {
        return ResponseEntity.ok(avisService.getByArtisanId(artisanId));
    }

    @PostMapping
    public ResponseEntity<AvisResponseDTO> create(@RequestBody AvisCreationDTO dto) {
        AvisResponseDTO response = avisService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
