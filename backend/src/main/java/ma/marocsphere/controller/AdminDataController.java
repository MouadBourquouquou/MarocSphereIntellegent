package ma.marocsphere.controller;

import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import ma.marocsphere.dto.AdminUpdateDTO;
import ma.marocsphere.service.AdminDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-data")
public class AdminDataController {

    private final AdminDataService adminDataService;

    public AdminDataController(AdminDataService adminDataService) {
        this.adminDataService = adminDataService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN_DATA')")
    public ResponseEntity<List<AdminResponseDTO>> getAll() {
        return ResponseEntity.ok(adminDataService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN_DATA')")
    public ResponseEntity<AdminResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(adminDataService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN_DATA')")
    public ResponseEntity<AdminResponseDTO> create(@RequestBody AdminCreationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminDataService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN_DATA')")
    public ResponseEntity<AdminResponseDTO> update(@PathVariable Long id, @RequestBody AdminUpdateDTO dto) {
        return ResponseEntity.ok(adminDataService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN_DATA')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminDataService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
