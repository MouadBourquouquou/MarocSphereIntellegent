package ma.marocsphere.repository;

import ma.marocsphere.entity.DMC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DMCRepo extends JpaRepository<DMC, Long> {
    List<DMC> findByZoneCouvertureContaining(String zone);
}
