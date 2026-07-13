package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.ChatCreationDTO;
import ma.marocsphere.dto.ChatResponseDTO;
import ma.marocsphere.entity.Chat;
import ma.marocsphere.entity.Utilisateur;
import ma.marocsphere.repository.ChatRepo;
import ma.marocsphere.repository.UtilisateurRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Primary
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepo chatRepo;
    private final UtilisateurRepo utilisateurRepo;

    @Override
    public ChatResponseDTO getById(Long id) {
        Chat chat = chatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Message non trouvé avec l'id : " + id));
        return toResponseDTO(chat);
    }

    @Override
    @Transactional
    public ChatResponseDTO create(ChatCreationDTO dto) {
        Utilisateur expediteur = utilisateurRepo.findById(dto.getExpediteurId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + dto.getExpediteurId()));
        Utilisateur destinataire = utilisateurRepo.findById(dto.getDestinataireId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + dto.getDestinataireId()));

        Chat chat = Chat.builder()
                .expediteur(expediteur)
                .destinataire(destinataire)
                .contenu(dto.getContenu())
                .dateEnvoi(dto.getDateEnvoi() != null ? dto.getDateEnvoi() : LocalDateTime.now())
                .lu(false)
                .build();
        Chat saved = chatRepo.save(chat);
        return toResponseDTO(saved);
    }

    private ChatResponseDTO toResponseDTO(Chat chat) {
        return ChatResponseDTO.builder()
                .id(chat.getId())
                .expediteurId(chat.getExpediteur().getId())
                .destinataireId(chat.getDestinataire().getId())
                .contenu(chat.getContenu())
                .dateEnvoi(chat.getDateEnvoi())
                .lu(chat.getLu())
                .build();
    }
}
