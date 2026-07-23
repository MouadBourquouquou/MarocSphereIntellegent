package ma.marocsphere.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "guide_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class GuideMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    @ToString.Exclude
    private GuideConversation conversation;

    @Column(updatable = false)
    private LocalDateTime dateEnvoi;

    @PrePersist
    protected void onCreate() {
        this.dateEnvoi = LocalDateTime.now();
    }
}
