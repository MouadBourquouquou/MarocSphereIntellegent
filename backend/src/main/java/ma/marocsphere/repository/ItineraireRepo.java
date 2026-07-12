package ma.marocsphere.repository;

import ma.marocsphere.entity.Itineraire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraireRepo extends JpaRepository<Itineraire, Long> {
    List<Itineraire> findByClientId(Long clientId);
    List<Itineraire> findByGenereParIATrue();
}
