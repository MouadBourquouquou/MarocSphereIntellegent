package ma.marocsphere.repository;

import ma.marocsphere.entity.EvenementTrace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvenementTraceRepo extends JpaRepository<EvenementTrace, Long> {
    List<EvenementTrace> findByArtisanId(Long artisanId);
}
