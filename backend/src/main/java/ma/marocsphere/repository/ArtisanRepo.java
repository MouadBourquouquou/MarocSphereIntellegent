package ma.marocsphere.repository;

import ma.marocsphere.entity.Artisan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtisanRepo extends JpaRepository<Artisan, Long> {
    Optional<Artisan> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Artisan> findByCategorieArtisanat(String categorie);
    List<Artisan> findByEligibleExportTrue();
    long countByEligibleExportTrue();

    @Query("SELECT a FROM Artisan a LEFT JOIN FETCH a.cooperative")
    List<Artisan> findAllWithCooperative();
}
