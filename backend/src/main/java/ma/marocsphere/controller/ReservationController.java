package ma.marocsphere.controller;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import ma.marocsphere.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponseDTO>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<ReservationResponseDTO>> getByGuideId(@PathVariable Long guideId) {
        return ResponseEntity.ok(reservationService.getByGuideId(guideId));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ReservationResponseDTO>> getByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(reservationService.getByClientId(clientId));
    }

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> create(@RequestBody ReservationCreationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.create(dto));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<ReservationResponseDTO> updateStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statut = body.get("statut");
        return ResponseEntity.ok(reservationService.updateStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
