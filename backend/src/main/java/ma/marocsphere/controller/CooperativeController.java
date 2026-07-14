package ma.marocsphere.controller;

import ma.marocsphere.dto.CooperativeCreationDTO;
import ma.marocsphere.dto.CooperativeResponseDTO;
import ma.marocsphere.service.CooperativeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cooperatives")
public class CooperativeController {

    private final CooperativeService cooperativeService;

    public CooperativeController(CooperativeService cooperativeService) {
        this.cooperativeService = cooperativeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CooperativeResponseDTO> getById(@PathVariable Long id) {
        CooperativeResponseDTO response = cooperativeService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Lookup a cooperative by exact name — used during artisan registration.
     * GET /api/cooperatives/search?nom=NomCooperative
     * Returns 200 + { id, nom } if found, 404 + { message } if not.
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchByNom(@RequestParam String nom) {
        return cooperativeService.findByNom(nom)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Aucune coopérative trouvée avec le nom : \"" + nom + "\"")));
    }

    @PostMapping
    public ResponseEntity<CooperativeResponseDTO> create(@RequestBody CooperativeCreationDTO dto) {
        CooperativeResponseDTO response = cooperativeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
