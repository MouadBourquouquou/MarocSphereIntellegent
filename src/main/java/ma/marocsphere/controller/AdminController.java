package ma.marocsphere.controller;

import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import ma.marocsphere.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> getById(@PathVariable UUID id) {
        AdminResponseDTO response = adminService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<AdminResponseDTO> create(@RequestBody AdminCreationDTO dto) {
        AdminResponseDTO response = adminService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
