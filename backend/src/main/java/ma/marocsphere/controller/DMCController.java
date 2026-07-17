package ma.marocsphere.controller;

import ma.marocsphere.dto.DMCCreationDTO;
import ma.marocsphere.dto.DMCResponseDTO;
import ma.marocsphere.service.DMCService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dmcs")
public class DMCController {

    private final DMCService dmcService;

    public DMCController(DMCService dmcService) {
        this.dmcService = dmcService;
    }

    @GetMapping
    public ResponseEntity<List<DMCResponseDTO>> getAll() {
        return ResponseEntity.ok(dmcService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DMCResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(dmcService.getById(id));
    }

    @PostMapping
    public ResponseEntity<DMCResponseDTO> create(@RequestBody DMCCreationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dmcService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dmcService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
