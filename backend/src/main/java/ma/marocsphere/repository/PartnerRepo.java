package ma.marocsphere.repository;

import ma.marocsphere.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnerRepo extends JpaRepository<Partner, Long> {
    List<Partner> findByDestinationId(Long destinationId);
    List<Partner> findByType(String type);
}
