package ma.marocsphere.controller;

import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;
import ma.marocsphere.service.DMCService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dmcs")
public class DMCController {

    private final DMCService dmcService;

    public DMCController(DMCService dmcService) {
        this.dmcService = dmcService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DMCResponseDTO> getById(@PathVariable UUID id) {
        DMCResponseDTO response = dmcService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<DMCResponseDTO> create(@RequestBody DMCCreationDTO dto) {
        DMCResponseDTO response = dmcService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
