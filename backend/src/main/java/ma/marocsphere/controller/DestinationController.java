package ma.marocsphere.controller;

import ma.marocsphere.dto.DestinationCreationDTO;
import ma.marocsphere.dto.DestinationResponseDTO;
import ma.marocsphere.service.DestinationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationResponseDTO> getById(@PathVariable Long id) {
        DestinationResponseDTO response = destinationService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<DestinationResponseDTO> create(@RequestBody DestinationCreationDTO dto) {
        DestinationResponseDTO response = destinationService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
