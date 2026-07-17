package ma.marocsphere.controller;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import ma.marocsphere.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> create(@RequestBody ReservationCreationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
