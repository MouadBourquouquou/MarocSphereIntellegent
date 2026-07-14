package ma.marocsphere.service;

import ma.marocsphere.dto.MessageCreationDTO;
import ma.marocsphere.dto.MessageResponseDTO;

import java.util.List;

public interface MessageService {
    List<MessageResponseDTO> getHistory(Long clientId);
    MessageResponseDTO sendMessage(MessageCreationDTO dto);
}
