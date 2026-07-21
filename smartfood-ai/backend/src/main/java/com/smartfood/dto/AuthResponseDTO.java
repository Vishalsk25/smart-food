package com.smartfood.dto;

import java.time.LocalDateTime;

public class AuthResponseDTO {
    private String token; private String refreshToken; private UserDTO user; private LocalDateTime expiresAt;
    public AuthResponseDTO() {}
    public AuthResponseDTO(String token, String refreshToken, UserDTO user, LocalDateTime expiresAt) {
        this.token = token; this.refreshToken = refreshToken; this.user = user; this.expiresAt = expiresAt;
    }
    public String getToken() { return token; } public void setToken(String v) { this.token = v; }
    public String getRefreshToken() { return refreshToken; } public void setRefreshToken(String v) { this.refreshToken = v; }
    public UserDTO getUser() { return user; } public void setUser(UserDTO v) { this.user = v; }
    public LocalDateTime getExpiresAt() { return expiresAt; } public void setExpiresAt(LocalDateTime v) { this.expiresAt = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AuthResponseDTO a = new AuthResponseDTO();
        public Builder token(String v) { a.token = v; return this; }
        public Builder refreshToken(String v) { a.refreshToken = v; return this; }
        public Builder user(UserDTO v) { a.user = v; return this; }
        public Builder expiresAt(LocalDateTime v) { a.expiresAt = v; return this; }
        public AuthResponseDTO build() { return a; }
    }
}
