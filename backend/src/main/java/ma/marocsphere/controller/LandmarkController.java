package ma.marocsphere.controller;

import ma.marocsphere.dto.LandmarkCreationDTO;
import ma.marocsphere.dto.LandmarkResponseDTO;
import ma.marocsphere.dto.LandmarkUpdateDTO;
import ma.marocsphere.service.LandmarkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/landmarks")
public class LandmarkController {

    private final LandmarkService landmarkService;

    public LandmarkController(LandmarkService landmarkService) {
        this.landmarkService = landmarkService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LandmarkResponseDTO>> getAll() {
        return ResponseEntity.ok(landmarkService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LandmarkResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(landmarkService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LandmarkResponseDTO> create(@RequestBody LandmarkCreationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(landmarkService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LandmarkResponseDTO> update(@PathVariable Long id, @RequestBody LandmarkUpdateDTO dto) {
        return ResponseEntity.ok(landmarkService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        landmarkService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import-csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LandmarkResponseDTO>> importCsv(@RequestParam("file") MultipartFile file) {
        List<LandmarkResponseDTO> imported = landmarkService.importCsv(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(imported);
    }
}
