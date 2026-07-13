package ma.marocsphere.controller;

import ma.marocsphere.dto.LandmarkCreationDTO;
import ma.marocsphere.dto.LandmarkResponseDTO;
import ma.marocsphere.service.LandmarkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/landmarks")
public class LandmarkController {

    private final LandmarkService landmarkService;

    public LandmarkController(LandmarkService landmarkService) {
        this.landmarkService = landmarkService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<LandmarkResponseDTO> getById(@PathVariable Long id) {
        LandmarkResponseDTO response = landmarkService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<LandmarkResponseDTO> create(@RequestBody LandmarkCreationDTO dto) {
        LandmarkResponseDTO response = landmarkService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
