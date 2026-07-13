package ma.marocsphere.service;

import ma.marocsphere.dto.ReviewCreationDTO;
import ma.marocsphere.dto.ReviewResponseDTO;

public interface ReviewService {
    ReviewResponseDTO getById(Long id);
    ReviewResponseDTO create(ReviewCreationDTO dto);
}
