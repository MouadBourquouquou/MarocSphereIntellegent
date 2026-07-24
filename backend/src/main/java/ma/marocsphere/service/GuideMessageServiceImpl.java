package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.GuideConversationResponseDTO;
import ma.marocsphere.dto.GuideMessageCreationDTO;
import ma.marocsphere.dto.GuideMessageResponseDTO;
import ma.marocsphere.entity.Client;
import ma.marocsphere.entity.Guide;
import ma.marocsphere.entity.GuideConversation;
import ma.marocsphere.entity.GuideMessage;
import ma.marocsphere.entity.MessageRole;
import ma.marocsphere.repository.ClientRepo;
import ma.marocsphere.repository.GuideConversationRepo;
import ma.marocsphere.repository.GuideMessageRepo;
import ma.marocsphere.repository.GuideRepo;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class GuideMessageServiceImpl implements GuideMessageService {

    private final GuideConversationRepo conversationRepo;
    private final GuideMessageRepo messageRepo;
    private final GuideRepo guideRepo;
    private final ClientRepo clientRepo;

    @Override
    public List<GuideConversationResponseDTO> getConversations(Long guideId) {
        return conversationRepo.findByGuideIdOrderByDateDernierMessageDesc(guideId).stream()
                .map(this::toConversationDTO)
                .toList();
    }

    @Override
    public List<GuideMessageResponseDTO> getMessages(Long conversationId) {
        return messageRepo.findByConversationIdOrderByDateEnvoiAsc(conversationId).stream()
                .map(this::toMessageDTO)
                .toList();
    }

    @Override
    @Transactional
    public GuideMessageResponseDTO sendMessage(Long guideId, GuideMessageCreationDTO dto) {
        GuideConversation conversation = conversationRepo.findById(dto.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation non trouvée : " + dto.getConversationId()));

        if (!conversation.getGuide().getId().equals(guideId)) {
            throw new RuntimeException("Cette conversation n'appartient pas à ce guide");
        }

        GuideMessage message = GuideMessage.builder()
                .conversation(conversation)
                .contenu(dto.getContenu())
                .role(MessageRole.USER)
                .build();
        GuideMessage saved = messageRepo.save(message);

        conversation.setDernierMessage(dto.getContenu());
        conversation.setDateDernierMessage(LocalDateTime.now());
        conversationRepo.save(conversation);

        return toMessageDTO(saved);
    }

    @Override
    @Transactional
    public GuideConversationResponseDTO getOrCreateConversation(Long guideId, Long clientId) {
        return conversationRepo.findByGuideIdAndClientId(guideId, clientId)
                .map(this::toConversationDTO)
                .orElseGet(() -> {
                    Guide guide = guideRepo.findById(guideId)
                            .orElseThrow(() -> new RuntimeException("Guide non trouvé : " + guideId));
                    Client client = clientRepo.findById(clientId)
                            .orElseThrow(() -> new RuntimeException("Client non trouvé : " + clientId));
                    GuideConversation conversation = GuideConversation.builder()
                            .guide(guide)
                            .client(client)
                            .messagesNonLus(0)
                            .build();
                    GuideConversation saved = conversationRepo.save(conversation);
                    return toConversationDTO(saved);
                });
    }

    private GuideConversationResponseDTO toConversationDTO(GuideConversation conv) {
        return GuideConversationResponseDTO.builder()
                .id(conv.getId())
                .guideId(conv.getGuide().getId())
                .clientId(conv.getClient().getId())
                .clientNom(conv.getClient().getNom())
                .clientPrenom(conv.getClient().getPrenom())
                .dernierMessage(conv.getDernierMessage())
                .dateDernierMessage(conv.getDateDernierMessage())
                .messagesNonLus(conv.getMessagesNonLus())
                .build();
    }

    private GuideMessageResponseDTO toMessageDTO(GuideMessage msg) {
        return GuideMessageResponseDTO.builder()
                .id(msg.getId())
                .conversationId(msg.getConversation().getId())
                .contenu(msg.getContenu())
                .role(msg.getRole().name())
                .dateEnvoi(msg.getDateEnvoi())
                .build();
    }
}
