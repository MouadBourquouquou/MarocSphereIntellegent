package ma.marocsphere.controller;

import ma.marocsphere.dto.EvenementTraceCreationDTO;
import ma.marocsphere.dto.EvenementTraceResponseDTO;
import ma.marocsphere.service.EvenementTraceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/evenements-trace")
public class EvenementTraceController {

    private final EvenementTraceService evenementTraceService;

    public EvenementTraceController(EvenementTraceService evenementTraceService) {
        this.evenementTraceService = evenementTraceService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvenementTraceResponseDTO> getById(@PathVariable UUID id) {
        EvenementTraceResponseDTO response = evenementTraceService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<EvenementTraceResponseDTO> create(@RequestBody EvenementTraceCreationDTO dto) {
        EvenementTraceResponseDTO response = evenementTraceService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
