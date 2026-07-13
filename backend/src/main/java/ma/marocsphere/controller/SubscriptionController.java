package ma.marocsphere.controller;

import ma.marocsphere.dto.SubscriptionCreationDTO;
import ma.marocsphere.dto.SubscriptionResponseDTO;
import ma.marocsphere.service.SubscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponseDTO> getById(@PathVariable Long id) {
        SubscriptionResponseDTO response = subscriptionService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponseDTO> create(@RequestBody SubscriptionCreationDTO dto) {
        SubscriptionResponseDTO response = subscriptionService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
