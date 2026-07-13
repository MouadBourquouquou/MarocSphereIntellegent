package ma.marocsphere.service;

import ma.marocsphere.dto.SubscriptionCreationDTO;
import ma.marocsphere.dto.SubscriptionResponseDTO;

public interface SubscriptionService {
    SubscriptionResponseDTO getById(Long id);
    SubscriptionResponseDTO create(SubscriptionCreationDTO dto);
}
