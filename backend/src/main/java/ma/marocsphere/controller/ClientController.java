package ma.marocsphere.controller;

import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;
import ma.marocsphere.dto.ClientUpdateDTO;
import ma.marocsphere.dto.ItineraireResponseDTO;
import ma.marocsphere.dto.ReservationResponseDTO;
import ma.marocsphere.service.ClientService;
import ma.marocsphere.service.ItineraireService;
import ma.marocsphere.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;
    private final ItineraireService itineraireService;
    private final ReservationService reservationService;

    public ClientController(ClientService clientService,
                            ItineraireService itineraireService,
                            ReservationService reservationService) {
        this.clientService = clientService;
        this.itineraireService = itineraireService;
        this.reservationService = reservationService;
    }

    @GetMapping("/me")
    public ResponseEntity<ClientResponseDTO> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ClientResponseDTO response = clientService.getByEmail(auth.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/itineraires")
    public ResponseEntity<List<ItineraireResponseDTO>> getItineraires(@PathVariable Long id) {
        return ResponseEntity.ok(itineraireService.getByClientId(id));
    }

    @GetMapping("/{id}/reservations")
    public ResponseEntity<List<ReservationResponseDTO>> getReservations(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getByClientId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> getById(@PathVariable Long id) {
        ClientResponseDTO response = clientService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> update(@PathVariable Long id, @RequestBody ClientUpdateDTO dto) {
        ClientResponseDTO response = clientService.update(id, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ClientResponseDTO> create(@RequestBody ClientCreationDTO dto) {
        ClientResponseDTO response = clientService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
