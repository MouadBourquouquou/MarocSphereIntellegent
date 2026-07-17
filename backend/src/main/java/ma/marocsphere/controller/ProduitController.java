package ma.marocsphere.controller;

import ma.marocsphere.dto.ProduitCreationDTO;
import ma.marocsphere.dto.ProduitDTO;
import ma.marocsphere.service.ProduitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProduitController {

    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @GetMapping("/artisans/{artisanId}/produits")
    public ResponseEntity<List<ProduitDTO>> getByArtisanId(@PathVariable Long artisanId) {
        return ResponseEntity.ok(produitService.getByArtisanId(artisanId));
    }

    @GetMapping("/produits/{id}")
    public ResponseEntity<ProduitDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.getById(id));
    }

    @PostMapping("/artisans/{artisanId}/produits")
    public ResponseEntity<ProduitDTO> create(@PathVariable Long artisanId, @RequestBody ProduitCreationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produitService.create(artisanId, dto));
    }

    @PutMapping("/produits/{id}")
    public ResponseEntity<ProduitDTO> update(@PathVariable Long id, @RequestBody ProduitCreationDTO dto) {
        return ResponseEntity.ok(produitService.update(id, dto));
    }

    @DeleteMapping("/produits/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
