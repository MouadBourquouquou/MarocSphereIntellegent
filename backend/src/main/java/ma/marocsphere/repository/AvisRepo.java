package ma.marocsphere.repository;

import ma.marocsphere.entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisRepo extends JpaRepository<Avis, Long> {
    List<Avis> findByClientId(Long clientId);
    List<Avis> findByGuideId(Long guideId);
}
