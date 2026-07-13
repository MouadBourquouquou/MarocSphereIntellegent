package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ReviewCreationDTO;
import ma.marocsphere.dto.ReviewResponseDTO;
import ma.marocsphere.entity.Destination;
import ma.marocsphere.entity.Review;
import ma.marocsphere.entity.Utilisateur;
import ma.marocsphere.repository.DestinationRepo;
import ma.marocsphere.repository.ReviewRepo;
import ma.marocsphere.repository.UtilisateurRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Primary
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepo reviewRepo;
    private final UtilisateurRepo utilisateurRepo;
    private final DestinationRepo destinationRepo;

    @Override
    public ReviewResponseDTO getById(Long id) {
        Review review = reviewRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Review non trouvée avec l'id : " + id));
        return toResponseDTO(review);
    }

    @Override
    @Transactional
    public ReviewResponseDTO create(ReviewCreationDTO dto) {
        Utilisateur utilisateur = utilisateurRepo.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + dto.getUtilisateurId()));
        Destination destination = destinationRepo.findById(dto.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination non trouvée : " + dto.getDestinationId()));

        Review review = Review.builder()
                .utilisateur(utilisateur)
                .destination(destination)
                .note(dto.getNote())
                .commentaire(dto.getCommentaire())
                .dateCreation(LocalDateTime.now())
                .build();
        Review saved = reviewRepo.save(review);
        return toResponseDTO(saved);
    }

    private ReviewResponseDTO toResponseDTO(Review review) {
        return ReviewResponseDTO.builder()
                .id(review.getId())
                .utilisateurId(review.getUtilisateur().getId())
                .destinationId(review.getDestination().getId())
                .note(review.getNote())
                .commentaire(review.getCommentaire())
                .dateCreation(review.getDateCreation())
                .build();
    }
}
