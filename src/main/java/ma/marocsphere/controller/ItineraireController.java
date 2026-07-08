package ma.marocsphere.controller;

import ma.marocsphere.dto.ItineraireCreationDTO;
import ma.marocsphere.dto.ItineraireResponseDTO;
import ma.marocsphere.service.ItineraireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/itineraires")
public class ItineraireController {

    private final ItineraireService itineraireService;

    public ItineraireController(ItineraireService itineraireService) {
        this.itineraireService = itineraireService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItineraireResponseDTO> getById(@PathVariable UUID id) {
        ItineraireResponseDTO response = itineraireService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ItineraireResponseDTO> create(@RequestBody ItineraireCreationDTO dto) {
        ItineraireResponseDTO response = itineraireService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
