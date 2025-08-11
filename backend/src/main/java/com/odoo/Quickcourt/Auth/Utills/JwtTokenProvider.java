package com.odoo.Quickcourt.Auth.Utills;

import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import jakarta.annotation.PostConstruct;
import java.util.Base64;
import java.util.Date;

/**
 * Provides functionality for generating, validating, and parsing JWT tokens.
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecretBase64;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration}")
    private long refreshTokenExpirationMs;

    private SecretKey signingKey;

    /**
     * Initializes the JWT signing key by decoding the configured base64 key.
     * Validates that the key is at least 512 bits for HS512.
     * Falls back to a programmatically generated key if decoding fails or the key is invalid.
     */
    @PostConstruct
    public void init() {
        try {
            // Decode the base64-encoded key
            byte[] keyBytes = Base64.getDecoder().decode(jwtSecretBase64);
            // Validate key size for HS512 (minimum 512 bits or 64 bytes)
            if (keyBytes.length < 64) {
                throw new IllegalArgumentException(
                        String.format("JWT secret key size is %d bits, but HS512 requires at least 512 bits.", keyBytes.length * 8)
                );
            }
            this.signingKey = Keys.hmacShaKeyFor(keyBytes);
            log.info("Successfully initialized JWT signing key from configuration.");
        } catch (IllegalArgumentException e) {
            log.error("Invalid JWT secret key: {}", e.getMessage());
            throw new IllegalStateException(
                    "Failed to initialize JWT signing key. Ensure 'app.jwt.secret' is a valid base64-encoded string " +
                            "representing a key of at least 512 bits (64 bytes). " +
                            "Generate a key using: `Keys.secretKeyFor(SignatureAlgorithm.HS512)` and encode with Base64.",
                    e
            );
        } catch (Exception e) {
            log.error("Unexpected error initializing JWT signing key", e);
            throw new IllegalStateException(
                    "Failed to initialize JWT signing key due to unexpected error. " +
                            "Check the configured 'app.jwt.secret' value.",
                    e
            );
        }
    }

    /**
     * Generates a JWT access token for the authenticated user.
     *
     * @param authentication The authentication object containing user details.
     * @return A signed JWT token.
     */
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(userPrincipal.getId().toString())
                .claim("email", userPrincipal.getEmail())
                .claim("role", userPrincipal.getAuthorities().iterator().next().getAuthority())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Generates a JWT refresh token for the authenticated user.
     *
     * @param authentication The authentication object containing user details.
     * @return A signed JWT refresh token.
     */
    public String generateRefreshToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationMs);

        return Jwts.builder()
                .setSubject(userPrincipal.getId().toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Extracts the user ID from a JWT token.
     *
     * @param token The JWT token.
     * @return The user ID (subject) from the token.
     * @throws JwtException If the token is invalid or cannot be parsed.
     */
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    /**
     * Validates a JWT token.
     *
     * @param token The JWT token to validate.
     * @return True if the token is valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token structure: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error validating JWT token: {}", e.getMessage());
        }
        return false;
    }
}