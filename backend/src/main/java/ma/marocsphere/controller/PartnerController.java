package ma.marocsphere.controller;

import ma.marocsphere.dto.PartnerCreationDTO;
import ma.marocsphere.dto.PartnerResponseDTO;
import ma.marocsphere.service.PartnerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partners")
public class PartnerController {

    private final PartnerService partnerService;

    public PartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartnerResponseDTO> getById(@PathVariable Long id) {
        PartnerResponseDTO response = partnerService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<PartnerResponseDTO> create(@RequestBody PartnerCreationDTO dto) {
        PartnerResponseDTO response = partnerService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
