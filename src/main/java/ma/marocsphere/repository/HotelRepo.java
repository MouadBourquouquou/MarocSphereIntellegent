package ma.marocsphere.repository;

import ma.marocsphere.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepo extends JpaRepository<Hotel, Long> {
    List<Hotel> findByLocalisation(String localisation);
    List<Hotel> findByPrixLessThanEqual(Float prixMax);
}
