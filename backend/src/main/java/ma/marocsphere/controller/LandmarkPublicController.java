package ma.marocsphere.controller;

import ma.marocsphere.dto.LandmarkResponseDTO;
import ma.marocsphere.service.LandmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/landmarks")
public class LandmarkPublicController {

    private final LandmarkService landmarkService;

    public LandmarkPublicController(LandmarkService landmarkService) {
        this.landmarkService = landmarkService;
    }

    @GetMapping
    public ResponseEntity<List<LandmarkResponseDTO>> getAll() {
        return ResponseEntity.ok(landmarkService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LandmarkResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(landmarkService.getById(id));
    }
}
