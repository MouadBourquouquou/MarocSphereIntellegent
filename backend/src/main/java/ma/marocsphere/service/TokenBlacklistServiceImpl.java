package ma.marocsphere.service;

import lombok.RequiredArgsConstructor;
import ma.marocsphere.entity.TokenBlacklist;
import ma.marocsphere.repository.TokenBlacklistRepo;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenBlacklistServiceImpl implements TokenBlacklistService {

    private final TokenBlacklistRepo tokenBlacklistRepo;

    @Override
    public void blacklist(String token) {
        if (!tokenBlacklistRepo.existsByToken(token)) {
            tokenBlacklistRepo.save(TokenBlacklist.builder()
                    .token(token)
                    .build());
        }
    }

    @Override
    public boolean isBlacklisted(String token) {
        return tokenBlacklistRepo.existsByToken(token);
    }
}
