package ma.marocsphere.controller;

import ma.marocsphere.dto.ClientCreationDTO;
import ma.marocsphere.dto.ClientResponseDTO;
import ma.marocsphere.service.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> getById(@PathVariable Long id) {
        ClientResponseDTO response = clientService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ClientResponseDTO> create(@RequestBody ClientCreationDTO dto) {
        ClientResponseDTO response = clientService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
