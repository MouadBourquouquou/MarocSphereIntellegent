package ma.marocsphere.controller;

import ma.marocsphere.dto.ReservationCreationDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import ma.marocsphere.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getById(@PathVariable UUID id) {
        ReservationResponseDTO response = reservationService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> create(@RequestBody ReservationCreationDTO dto) {
        ReservationResponseDTO response = reservationService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
