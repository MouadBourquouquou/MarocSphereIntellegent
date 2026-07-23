package ma.marocsphere.controller;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.dto.GuideConversationResponseDTO;
import ma.marocsphere.dto.GuideMessageCreationDTO;
import ma.marocsphere.dto.GuideMessageResponseDTO;
import ma.marocsphere.service.ExperienceService;
import ma.marocsphere.service.GuideMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guide-messages")
@RequiredArgsConstructor
public class GuideMessageController {

    private final GuideMessageService guideMessageService;
    private final ExperienceService experienceService;

    @GetMapping("/conversations")
    public ResponseEntity<List<GuideConversationResponseDTO>> getMyConversations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long guideId = experienceService.getGuideIdByEmail(email);
        return ResponseEntity.ok(guideMessageService.getConversations(guideId));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<GuideMessageResponseDTO>> getMessages(@PathVariable Long conversationId) {
        return ResponseEntity.ok(guideMessageService.getMessages(conversationId));
    }

    @PostMapping("/send")
    public ResponseEntity<GuideMessageResponseDTO> sendMessage(@RequestBody GuideMessageCreationDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long guideId = experienceService.getGuideIdByEmail(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(guideMessageService.sendMessage(guideId, dto));
    }

    @PostMapping("/conversations")
    public ResponseEntity<GuideConversationResponseDTO> getOrCreateConversation(@RequestParam Long clientId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long guideId = experienceService.getGuideIdByEmail(email);
        return ResponseEntity.ok(guideMessageService.getOrCreateConversation(guideId, clientId));
    }
}
