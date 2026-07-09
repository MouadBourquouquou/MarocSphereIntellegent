package ma.marocsphere.controller;

import ma.marocsphere.dto.CooperativeCreationDTO;
import ma.marocsphere.dto.CooperativeResponseDTO;
import ma.marocsphere.service.CooperativeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



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

    @PostMapping
    public ResponseEntity<CooperativeResponseDTO> create(@RequestBody CooperativeCreationDTO dto) {
        CooperativeResponseDTO response = cooperativeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
