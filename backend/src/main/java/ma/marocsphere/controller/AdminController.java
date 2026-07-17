package ma.marocsphere.controller;

import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import ma.marocsphere.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<List<AdminResponseDTO>> getAll() {
        return ResponseEntity.ok(adminService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AdminResponseDTO> create(@RequestBody AdminCreationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
