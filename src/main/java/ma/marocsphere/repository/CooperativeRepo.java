package ma.marocsphere.repository;

import ma.marocsphere.entity.Cooperative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CooperativeRepo extends JpaRepository<Cooperative, Long> {
    Optional<Cooperative> findByNom(String nom);
}
