package ma.marocsphere.repository;

import ma.marocsphere.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepo extends JpaRepository<Experience, Long> {
    List<Experience> findByGuideId(Long guideId);
    List<Experience> findByGuideIdAndStatut(Long guideId, String statut);
}
