package ma.marocsphere.service;

import ma.marocsphere.dto.ChatCreationDTO;
import ma.marocsphere.dto.ChatResponseDTO;

public interface ChatService {
    ChatResponseDTO getById(Long id);
    ChatResponseDTO create(ChatCreationDTO dto);
}
