package ma.marocsphere.repository;

import ma.marocsphere.entity.Artisan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtisanRepo extends JpaRepository<Artisan, Long> {
    Optional<Artisan> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Artisan> findByCategorieArtisanat(String categorie);
    List<Artisan> findByEligibleExportTrue();
}
