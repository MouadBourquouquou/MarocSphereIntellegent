package ma.marocsphere.controller;

import ma.marocsphere.dto.ChatCreationDTO;
import ma.marocsphere.dto.ChatResponseDTO;
import ma.marocsphere.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatResponseDTO> getById(@PathVariable Long id) {
        ChatResponseDTO response = chatService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> create(@RequestBody ChatCreationDTO dto) {
        ChatResponseDTO response = chatService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
