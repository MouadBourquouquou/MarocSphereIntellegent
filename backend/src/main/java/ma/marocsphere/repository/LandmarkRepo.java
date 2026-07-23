package ma.marocsphere.repository;

import ma.marocsphere.entity.Landmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LandmarkRepo extends JpaRepository<Landmark, Long> {
    Optional<Landmark> findByNomAndZone(String nom, String zone);
    boolean existsByNomAndZone(String nom, String zone);
    List<Landmark> findByCategorie(String categorie);
    List<Landmark> findByZone(String zone);
}
