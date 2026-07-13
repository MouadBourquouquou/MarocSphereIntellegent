package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.PartnerCreationDTO;
import ma.marocsphere.dto.PartnerResponseDTO;
import ma.marocsphere.entity.Destination;
import ma.marocsphere.entity.Partner;
import ma.marocsphere.repository.DestinationRepo;
import ma.marocsphere.repository.PartnerRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Primary
@RequiredArgsConstructor
public class PartnerServiceImpl implements PartnerService {

    private final PartnerRepo partnerRepo;
    private final DestinationRepo destinationRepo;

    @Override
    public PartnerResponseDTO getById(Long id) {
        Partner partner = partnerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Partenaire non trouvé avec l'id : " + id));
        return toResponseDTO(partner);
    }

    @Override
    @Transactional
    public PartnerResponseDTO create(PartnerCreationDTO dto) {
        Destination destination = destinationRepo.findById(dto.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination non trouvée : " + dto.getDestinationId()));

        Partner partner = Partner.builder()
                .destination(destination)
                .nom(dto.getNom())
                .type(dto.getType())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .localisation(dto.getLocalisation())
                .siteWeb(dto.getSiteWeb())
                .build();
        Partner saved = partnerRepo.save(partner);
        return toResponseDTO(saved);
    }

    private PartnerResponseDTO toResponseDTO(Partner partner) {
        return PartnerResponseDTO.builder()
                .id(partner.getId())
                .destinationId(partner.getDestination().getId())
                .nom(partner.getNom())
                .type(partner.getType())
                .email(partner.getEmail())
                .telephone(partner.getTelephone())
                .localisation(partner.getLocalisation())
                .siteWeb(partner.getSiteWeb())
                .build();
    }
}
