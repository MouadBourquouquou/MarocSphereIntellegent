package ma.marocsphere.controller;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.MessageCreationDTO;
import ma.marocsphere.dto.MessageResponseDTO;
import ma.marocsphere.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/{clientId}")
    public ResponseEntity<List<MessageResponseDTO>> getHistory(@PathVariable Long clientId) {
        return ResponseEntity.ok(messageService.getHistory(clientId));
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageCreationDTO dto) {
        if (dto.getClientId() == null || dto.getContenu() == null || dto.getContenu().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "clientId et contenu sont requis"
            ));
        }
        MessageResponseDTO response = messageService.sendMessage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
