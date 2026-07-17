package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ProduitCreationDTO;
import ma.marocsphere.dto.ProduitDTO;
import ma.marocsphere.entity.Artisan;
import ma.marocsphere.entity.Produit;
import ma.marocsphere.repository.ArtisanRepo;
import ma.marocsphere.repository.ProduitRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class ProduitServiceImpl implements ProduitService {

    private final ProduitRepo produitRepo;
    private final ArtisanRepo artisanRepo;

    @Override
    public List<ProduitDTO> getByArtisanId(Long artisanId) {
        return produitRepo.findByArtisanId(artisanId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public ProduitDTO getById(Long id) {
        Produit produit = produitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + id));
        return toDTO(produit);
    }

    @Override
    @Transactional
    public ProduitDTO create(Long artisanId, ProduitCreationDTO dto) {
        Artisan artisan = artisanRepo.findById(artisanId)
                .orElseThrow(() -> new RuntimeException("Artisan non trouvé avec l'id : " + artisanId));

        Produit produit = Produit.builder()
                .nom(dto.getNom())
                .description(dto.getDescription())
                .categorie(dto.getCategorie())
                .prix(dto.getPrix())
                .stock(dto.getStock())
                .disponibilite(dto.getDisponibilite() != null ? dto.getDisponibilite() : "In Stock")
                .note(dto.getNote() != null ? dto.getNote() : 0.0)
                .nbCommandes(0)
                .imageUrl(dto.getImageUrl())
                .materiels(dto.getMateriels())
                .processFabrication(dto.getProcessFabrication())
                .artisan(artisan)
                .build();

        Produit saved = produitRepo.save(produit);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public ProduitDTO update(Long id, ProduitCreationDTO dto) {
        Produit produit = produitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + id));

        if (dto.getNom() != null) produit.setNom(dto.getNom());
        if (dto.getDescription() != null) produit.setDescription(dto.getDescription());
        if (dto.getCategorie() != null) produit.setCategorie(dto.getCategorie());
        if (dto.getPrix() != null) produit.setPrix(dto.getPrix());
        if (dto.getStock() != null) produit.setStock(dto.getStock());
        if (dto.getDisponibilite() != null) produit.setDisponibilite(dto.getDisponibilite());
        if (dto.getNote() != null) produit.setNote(dto.getNote());
        if (dto.getImageUrl() != null) produit.setImageUrl(dto.getImageUrl());
        if (dto.getMateriels() != null) produit.setMateriels(dto.getMateriels());
        if (dto.getProcessFabrication() != null) produit.setProcessFabrication(dto.getProcessFabrication());

        Produit saved = produitRepo.save(produit);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!produitRepo.existsById(id)) {
            throw new RuntimeException("Produit non trouvé avec l'id : " + id);
        }
        produitRepo.deleteById(id);
    }

    private ProduitDTO toDTO(Produit produit) {
        return ProduitDTO.builder()
                .id(produit.getId())
                .nom(produit.getNom())
                .description(produit.getDescription())
                .categorie(produit.getCategorie())
                .prix(produit.getPrix())
                .stock(produit.getStock())
                .disponibilite(produit.getDisponibilite())
                .note(produit.getNote())
                .nbCommandes(produit.getNbCommandes())
                .imageUrl(produit.getImageUrl())
                .materiels(produit.getMateriels())
                .processFabrication(produit.getProcessFabrication())
                .artisanId(produit.getArtisan().getId())
                .dateCreation(produit.getDateCreation())
                .build();
    }
}
