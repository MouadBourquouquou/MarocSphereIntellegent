package ma.marocsphere.repository;

import ma.marocsphere.entity.Reservation;
import ma.marocsphere.entity.ReservationStatus;
import ma.marocsphere.entity.ReservationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Long> {

    List<Reservation> findByClientId(Long clientId);

    List<Reservation> findByResourceType(ReservationType resourceType);

    List<Reservation> findByStatut(ReservationStatus statut);

    long countByStatut(ReservationStatus statut);

    long countByResourceType(ReservationType resourceType);

    List<Reservation> findByResourceTypeAndResourceId(ReservationType resourceType, Long resourceId);

    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.client WHERE r.resourceType = :resourceType AND r.resourceId = :resourceId")
    List<Reservation> findByResourceTypeAndResourceIdWithClient(@Param("resourceType") ReservationType resourceType, @Param("resourceId") Long resourceId);

    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.client")
    List<Reservation> findAllWithClient();
}
