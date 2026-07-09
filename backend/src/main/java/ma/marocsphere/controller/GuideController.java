package ma.marocsphere.controller;

import ma.marocsphere.dto.GuideCreationDTO;
import ma.marocsphere.dto.GuideResponseDTO;
import ma.marocsphere.service.GuideService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/guides")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuideResponseDTO> getById(@PathVariable Long id) {
        GuideResponseDTO response = guideService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<GuideResponseDTO> create(@RequestBody GuideCreationDTO dto) {
        GuideResponseDTO response = guideService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
