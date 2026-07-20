package ma.marocsphere.repository;

import ma.marocsphere.entity.AdminData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminDataRepo extends JpaRepository<AdminData, Long> {
    Optional<AdminData> findByEmail(String email);
    boolean existsByEmail(String email);
}
