package ma.marocsphere.controller;

import ma.marocsphere.dto.ArtisanCreationDTO;
import ma.marocsphere.dto.ArtisanResponseDTO;
import ma.marocsphere.service.ArtisanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/api/artisans")
public class ArtisanController {

    private final ArtisanService artisanService;

    public ArtisanController(ArtisanService artisanService) {
        this.artisanService = artisanService;
    }

    @GetMapping
    public ResponseEntity<List<ArtisanResponseDTO>> getAll() {
        return ResponseEntity.ok(artisanService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtisanResponseDTO> getById(@PathVariable Long id) {
        ArtisanResponseDTO response = artisanService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ArtisanResponseDTO> create(@RequestBody ArtisanCreationDTO dto) {
        ArtisanResponseDTO response = artisanService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
