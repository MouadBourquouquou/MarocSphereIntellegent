package ma.marocsphere.controller;

import ma.marocsphere.dto.CommandeDTO;
import ma.marocsphere.dto.CommandeUpdateDTO;
import ma.marocsphere.service.CommandeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommandeController {

    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @GetMapping("/artisans/{artisanId}/commandes")
    public ResponseEntity<List<CommandeDTO>> getByArtisanId(@PathVariable Long artisanId) {
        return ResponseEntity.ok(commandeService.getByArtisanId(artisanId));
    }

    @GetMapping("/commandes/{id}")
    public ResponseEntity<CommandeDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getById(id));
    }

    @PutMapping("/commandes/{id}/statut")
    public ResponseEntity<CommandeDTO> updateStatut(@PathVariable Long id, @RequestBody CommandeUpdateDTO dto) {
        return ResponseEntity.ok(commandeService.updateStatut(id, dto));
    }
}
