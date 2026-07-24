package ma.marocsphere.service;

import ma.marocsphere.dto.GuideConversationResponseDTO;
import ma.marocsphere.dto.GuideMessageCreationDTO;
import ma.marocsphere.dto.GuideMessageResponseDTO;

import java.util.List;

public interface GuideMessageService {
    List<GuideConversationResponseDTO> getConversations(Long guideId);
    List<GuideMessageResponseDTO> getMessages(Long conversationId);
    GuideMessageResponseDTO sendMessage(Long guideId, GuideMessageCreationDTO dto);
    GuideConversationResponseDTO getOrCreateConversation(Long guideId, Long clientId);
}
