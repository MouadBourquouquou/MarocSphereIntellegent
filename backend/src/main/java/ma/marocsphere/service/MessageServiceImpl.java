package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.MessageCreationDTO;
import ma.marocsphere.dto.MessageResponseDTO;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Message;
import ma.marocsphere.entity.MessageRole;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.MessageRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepo messageRepo;
    private final ClientRepo clientRepo;

    @Override
    public List<MessageResponseDTO> getHistory(Long clientId) {
        return messageRepo.findByClientIdOrderByDateEnvoiAsc(clientId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public MessageResponseDTO sendMessage(MessageCreationDTO dto) {
        Client client = clientRepo.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé : " + dto.getClientId()));

        Message userMessage = Message.builder()
                .client(client)
                .contenu(dto.getContenu())
                .role(MessageRole.USER)
                .build();
        messageRepo.save(userMessage);

        String aiResponse = generateAiResponse(dto.getContenu());

        Message aiMessage = Message.builder()
                .client(client)
                .contenu(aiResponse)
                .role(MessageRole.AI)
                .build();
        Message savedAi = messageRepo.save(aiMessage);

        return toResponseDTO(savedAi);
    }

    private String generateAiResponse(String userMessage) {
        String lower = userMessage.toLowerCase();

        if (lower.contains("itinéraire") || lower.contains("itinerary") || lower.contains("plan")) {
            return "Je peux vous créer un itinéraire personnalisé au Maroc ! Pour commencer, dites-moi :\n"
                    + "- La durée de votre séjour\n"
                    + "- Les villes qui vous intéressent (Marrakech, Fès, Chefchaouen, Essaouira...)\n"
                    + "- Vos centres d'intérêt (culture, gastronomie, aventure, nature)";
        }
        if (lower.contains("guide") || lower.contains("certified")) {
            return "Je peux vous recommander des guides certifiés dans votre région. Quelle ville visiterez-vous ? "
                    + "Nous avons des guides spécialisés en histoire, gastronomie et aventure.";
        }
        if (lower.contains("artisan") || lower.contains("rug") || lower.contains("tapis")) {
            return "Le Maroc est réputé pour ses artisans ! Je peux vous orienter vers des cooperatives locales "
                    + "authentiques. Quel type d'artisanat vous intéresse ? (tapisserie, poterie, bijoux, cuir...)";
        }
        if (lower.contains("hotel") || lower.contains("riad") || lower.contains("hébergement")) {
            return "Nous avons une sélection d'hôtels et riads authentiques. Quelle ville et quel budget envisagez-vous ? "
                    + "Je peux vous proposer des options du meilleur rapport qualité-prix.";
        }
        if (lower.contains("sahara") || lower.contains("désert") || lower.contains("desert") || lower.contains("camel")) {
            return "L'excursion au Sahara est inoubliable ! Depuis Ouarzazate ou Errachidia, je peux vous organiser "
                    + "un safari en 4x4 avec nuit sous les étoiles à Merzouga ou Zagora.";
        }
        if (lower.contains("prix") || lower.contains("tarif") || lower.contains("coût") || lower.contains("budget")) {
            return "Les prix varient selon la saison et le type de service. Pouvez-vous me préciser "
                    + "ce que vous recherchez (guide, hôtel, excursion, artisan) pour vous donner une estimation ?";
        }

        return "Merci pour votre message ! Je suis votre assistant MarocSphere. "
                + "Je peux vous aider à planifier votre voyage au Maroc : itinéraires, guides certifiés, "
                + "hôtels, artisans locaux et excursions. N'hésitez pas à me poser vos questions !";
    }

    private MessageResponseDTO toResponseDTO(Message message) {
        return MessageResponseDTO.builder()
                .id(message.getId())
                .clientId(message.getClient().getId())
                .contenu(message.getContenu())
                .role(message.getRole().name())
                .dateEnvoi(message.getDateEnvoi())
                .build();
    }
}
