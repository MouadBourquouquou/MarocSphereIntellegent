package ma.marocsphere.repository;

import ma.marocsphere.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepo extends JpaRepository<Destination, Long> {
    List<Destination> findByRegion(String region);
    List<Destination> findByPays(String pays);
    List<Destination> findByType(String type);
}
