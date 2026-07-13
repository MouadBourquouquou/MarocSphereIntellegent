package ma.marocsphere.repository;

import ma.marocsphere.entity.Landmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandmarkRepo extends JpaRepository<Landmark, Long> {
    List<Landmark> findByDestinationId(Long destinationId);
    List<Landmark> findByType(String type);
}
