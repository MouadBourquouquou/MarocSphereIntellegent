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
import java.util.Map;

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

    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> getAll() {
        return ResponseEntity.ok(clientService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isClient = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CLIENT"));
        if (!isClient) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Accès réservé aux clients."));
        }
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
