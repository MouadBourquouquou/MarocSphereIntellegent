package ma.marocsphere.service;

public interface TokenBlacklistService {
    void blacklist(String token);
    boolean isBlacklisted(String token);
}
