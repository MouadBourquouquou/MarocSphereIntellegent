package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.LandmarkCreationDTO;
import ma.marocsphere.dto.LandmarkResponseDTO;
import ma.marocsphere.dto.LandmarkUpdateDTO;
import ma.marocsphere.entity.Landmark;
import ma.marocsphere.repository.LandmarkRepo;
import ma.marocsphere.exception.CsvImportException;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Primary
@RequiredArgsConstructor
public class LandmarkServiceImpl implements LandmarkService {

    private final LandmarkRepo landmarkRepo;

    @Override
    public LandmarkResponseDTO getById(Long id) {
        Landmark landmark = landmarkRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Landmark non trouvé avec l'id : " + id));
        return toResponseDTO(landmark);
    }

    @Override
    public List<LandmarkResponseDTO> getAll() {
        return landmarkRepo.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public LandmarkResponseDTO create(LandmarkCreationDTO dto) {
        if (landmarkRepo.existsByNomAndZone(dto.getNom(), dto.getZone())) {
            throw new RuntimeException("Un landmark avec ce nom et cette zone existe déjà : " + dto.getNom() + " (" + dto.getZone() + ")");
        }
        Landmark landmark = Landmark.builder()
                .nom(dto.getNom())
                .categorie(dto.getCategorie())
                .zone(dto.getZone())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .categoriePrix(dto.getCategoriePrix())
                .prixEntree(dto.getPrixEntree())
                .historicalPeriod(dto.getHistoricalPeriod())
                .unesco(dto.getUnesco() != null ? dto.getUnesco() : false)
                .intangibleHeritage(dto.getIntangibleHeritage())
                .architecturalNotes(dto.getArchitecturalNotes())
                .description(dto.getDescription())
                .build();
        Landmark saved = landmarkRepo.save(landmark);
        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public LandmarkResponseDTO update(Long id, LandmarkUpdateDTO dto) {
        Landmark landmark = landmarkRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Landmark non trouvé avec l'id : " + id));
        if (dto.getNom() != null) landmark.setNom(dto.getNom());
        if (dto.getCategorie() != null) landmark.setCategorie(dto.getCategorie());
        if (dto.getZone() != null) landmark.setZone(dto.getZone());
        if (dto.getLatitude() != null) landmark.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) landmark.setLongitude(dto.getLongitude());
        if (dto.getCategoriePrix() != null) landmark.setCategoriePrix(dto.getCategoriePrix());
        if (dto.getPrixEntree() != null) landmark.setPrixEntree(dto.getPrixEntree());
        if (dto.getHistoricalPeriod() != null) landmark.setHistoricalPeriod(dto.getHistoricalPeriod());
        if (dto.getUnesco() != null) landmark.setUnesco(dto.getUnesco());
        if (dto.getIntangibleHeritage() != null) landmark.setIntangibleHeritage(dto.getIntangibleHeritage());
        if (dto.getArchitecturalNotes() != null) landmark.setArchitecturalNotes(dto.getArchitecturalNotes());
        if (dto.getDescription() != null) landmark.setDescription(dto.getDescription());
        return toResponseDTO(landmarkRepo.save(landmark));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!landmarkRepo.existsById(id)) {
            throw new RuntimeException("Landmark non trouvé avec l'id : " + id);
        }
        landmarkRepo.deleteById(id);
    }

    @Override
    @Transactional
    public List<LandmarkResponseDTO> importCsv(MultipartFile file) {
        List<LandmarkResponseDTO> imported = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null || headerLine.isBlank()) {
                throw new CsvImportException("Le fichier CSV est vide.");
            }

            String[] headers = parseCsvLine(headerLine);
            Map<String, Integer> colIndex = new HashMap<>();
            for (int i = 0; i < headers.length; i++) {
                colIndex.put(headers[i].trim().toLowerCase(), i);
            }

            List<String> missing = new ArrayList<>();
            for (String req : List.of("name", "category", "latitude", "longitude", "zone", "price_category", "entry_price_mad")) {
                if (!colIndex.containsKey(req)) missing.add(req);
            }
            if (!missing.isEmpty()) {
                throw new CsvImportException("Colonnes obligatoires manquantes : " + String.join(", ", missing));
            }

            int lineNum = 1;
            String line;
            while ((line = reader.readLine()) != null) {
                lineNum++;
                if (line.trim().isEmpty()) continue;

                String[] parts = parseCsvLine(line);
                Map<String, String> row = new HashMap<>();
                for (Map.Entry<String, Integer> e : colIndex.entrySet()) {
                    if (e.getValue() < parts.length) {
                        row.put(e.getKey(), parts[e.getValue()].trim());
                    }
                }

                String nom = row.get("name");
                String categorie = row.get("category");
                String zone = row.get("zone");

                if (nom == null || nom.isBlank()) {
                    throw new CsvImportException("Ligne " + lineNum + " : le nom est obligatoire.");
                }
                if (categorie == null || categorie.isBlank()) {
                    throw new CsvImportException("Ligne " + lineNum + " : la catégorie est obligatoire.");
                }
                if (zone == null || zone.isBlank()) {
                    throw new CsvImportException("Ligne " + lineNum + " : la zone est obligatoire.");
                }

                double latitude;
                try {
                    latitude = Double.parseDouble(row.getOrDefault("latitude", ""));
                } catch (NumberFormatException e) {
                    throw new CsvImportException("Ligne " + lineNum + " : latitude invalide ('" + row.get("latitude") + "').");
                }

                double longitude;
                try {
                    longitude = Double.parseDouble(row.getOrDefault("longitude", ""));
                } catch (NumberFormatException e) {
                    throw new CsvImportException("Ligne " + lineNum + " : longitude invalide ('" + row.get("longitude") + "').");
                }

                String categoriePrix = row.getOrDefault("price_category", "Gratuit");
                double prixEntree;
                try {
                    prixEntree = Double.parseDouble(row.getOrDefault("entry_price_mad", "0"));
                } catch (NumberFormatException e) {
                    throw new CsvImportException("Ligne " + lineNum + " : prix invalide ('" + row.get("entry_price_mad") + "').");
                }

                String description = row.getOrDefault("description", null);
                if (description != null && description.isBlank()) description = null;

                String historicalPeriod = row.getOrDefault("historical_period", null);
                if (historicalPeriod != null && historicalPeriod.isBlank()) historicalPeriod = null;

                boolean unesco = Boolean.parseBoolean(row.getOrDefault("unesco", "false"));

                String intangibleHeritage = row.getOrDefault("intangible_heritage", null);
                if (intangibleHeritage != null && intangibleHeritage.isBlank()) intangibleHeritage = null;

                String architecturalNotes = row.getOrDefault("architectural_notes", null);
                if (architecturalNotes != null && architecturalNotes.isBlank()) architecturalNotes = null;

                if (landmarkRepo.existsByNomAndZone(nom, zone)) continue;

                Landmark landmark = Landmark.builder()
                        .nom(nom)
                        .categorie(categorie)
                        .zone(zone)
                        .latitude(latitude)
                        .longitude(longitude)
                        .categoriePrix(categoriePrix)
                        .prixEntree(prixEntree)
                        .historicalPeriod(historicalPeriod)
                        .unesco(unesco)
                        .intangibleHeritage(intangibleHeritage)
                        .architecturalNotes(architecturalNotes)
                        .description(description)
                        .build();
                Landmark saved = landmarkRepo.save(landmark);
                imported.add(toResponseDTO(saved));
            }
        } catch (CsvImportException e) {
            throw e;
        } catch (Exception e) {
            throw new CsvImportException("Erreur lors de la lecture du fichier CSV : " + e.getMessage());
        }
        return imported;
    }

    private String[] parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        result.add(current.toString());
        return result.toArray(new String[0]);
    }

    private LandmarkResponseDTO toResponseDTO(Landmark landmark) {
        return LandmarkResponseDTO.builder()
                .id(landmark.getId())
                .nom(landmark.getNom())
                .categorie(landmark.getCategorie())
                .zone(landmark.getZone())
                .latitude(landmark.getLatitude())
                .longitude(landmark.getLongitude())
                .categoriePrix(landmark.getCategoriePrix())
                .prixEntree(landmark.getPrixEntree())
                .historicalPeriod(landmark.getHistoricalPeriod())
                .unesco(landmark.getUnesco())
                .intangibleHeritage(landmark.getIntangibleHeritage())
                .architecturalNotes(landmark.getArchitecturalNotes())
                .description(landmark.getDescription())
                .build();
    }
}
