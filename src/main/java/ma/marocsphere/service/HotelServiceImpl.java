package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.HotelCreationDTO;
import ma.marocsphere.dto.HotelResponseDTO;
import ma.marocsphere.entity.Hotel;
import ma.marocsphere.repository.HotelRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Primary // remplace HotelServiceFake comme implémentation par défaut
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepo hotelRepo;

    @Override
    public HotelResponseDTO getById(UUID id) {
        Hotel hotel = hotelRepo.findById(id.getMostSignificantBits() & Long.MAX_VALUE)
                .orElseThrow(() -> new RuntimeException("Hotel non trouvé avec l'id : " + id));
        return toResponseDTO(hotel);
    }

    @Override
    public HotelResponseDTO create(HotelCreationDTO dto) {
        Hotel hotel = Hotel.builder()
                .nom(dto.getNom())
                .prix(dto.getPrix())
                .localisation(dto.getLocalisation())
                .build();

        Hotel saved = hotelRepo.save(hotel);
        return toResponseDTO(saved);
    }

    // ---- Méthode de mapping entité → DTO ----
    private HotelResponseDTO toResponseDTO(Hotel hotel) {
        return HotelResponseDTO.builder()
                .id(UUID.nameUUIDFromBytes(("hotel-" + hotel.getId()).getBytes()))
                .nom(hotel.getNom())
                .prix(hotel.getPrix())
                .localisation(hotel.getLocalisation())
                .description(null) // champ pas encore dans l'entité Hotel
                .build();
    }
}
