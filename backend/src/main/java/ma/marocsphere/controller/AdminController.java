package ma.marocsphere.controller;

import ma.marocsphere.dto.AdminCreationDTO;
import ma.marocsphere.dto.AdminResponseDTO;
import ma.marocsphere.dto.AdminUpdateDTO;
import ma.marocsphere.dto.PlatformStatsDTO;
import ma.marocsphere.entity.ReservationStatus;
import ma.marocsphere.repository.AdminRepo;
import ma.marocsphere.repository.ArtisanRepo;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.DMCRepo;
import ma.marocsphere.repository.GuideRepo;
import ma.marocsphere.repository.ReservationRepo;
import ma.marocsphere.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;
    private final ClientRepo clientRepo;
    private final GuideRepo guideRepo;
    private final ArtisanRepo artisanRepo;
    private final DMCRepo dmcRepo;
    private final AdminRepo adminRepo;
    private final ReservationRepo reservationRepo;

    public AdminController(AdminService adminService,
                           ClientRepo clientRepo,
                           GuideRepo guideRepo,
                           ArtisanRepo artisanRepo,
                           DMCRepo dmcRepo,
                           AdminRepo adminRepo,
                           ReservationRepo reservationRepo) {
        this.adminService = adminService;
        this.clientRepo = clientRepo;
        this.guideRepo = guideRepo;
        this.artisanRepo = artisanRepo;
        this.dmcRepo = dmcRepo;
        this.adminRepo = adminRepo;
        this.reservationRepo = reservationRepo;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminResponseDTO>> getAll() {
        return ResponseEntity.ok(adminService.getAll());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMIN_DATA')")
    public ResponseEntity<PlatformStatsDTO> getStats() {
        PlatformStatsDTO stats = PlatformStatsDTO.builder()
                .totalClients(clientRepo.count())
                .totalGuides(guideRepo.count())
                .totalArtisans(artisanRepo.count())
                .totalDmcs(dmcRepo.count())
                .totalAdmins(adminRepo.count())
                .totalReservations(reservationRepo.count())
                .reservationsConfirmees(reservationRepo.countByStatut(ReservationStatus.CONFIRMED))
                .reservationsEnAttente(reservationRepo.countByStatut(ReservationStatus.PENDING))
                .guidesDisponibles(guideRepo.countByDisponibleTrue())
                .artisansEligiblesExport(artisanRepo.countByEligibleExportTrue())
                .build();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponseDTO> create(@RequestBody AdminCreationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponseDTO> update(@PathVariable Long id, @RequestBody AdminUpdateDTO dto) {
        return ResponseEntity.ok(adminService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
