package ma.marocsphere.repository;

import ma.marocsphere.entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandeRepo extends JpaRepository<Commande, Long> {

    @Query("SELECT DISTINCT c FROM Commande c JOIN c.items i JOIN i.produit p WHERE p.artisan.id = :artisanId ORDER BY c.dateCommande DESC")
    List<Commande> findByArtisanId(@Param("artisanId") Long artisanId);

    List<Commande> findByStatut(String statut);
}
