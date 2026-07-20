package ma.marocsphere.repository;

import ma.marocsphere.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideRepo extends JpaRepository<Guide, Long> {
    Optional<Guide> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Guide> findByDisponibleTrue();
    long countByDisponibleTrue();
}
