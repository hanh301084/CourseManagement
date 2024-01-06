package com.fpt.scms.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import com.fpt.scms.config.AppConfig;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

import javax.crypto.SecretKey;

@Service
public class TokenProvider {

    private final AppConfig appConfig;
    private final SecretKey key;

    private static final Logger logger = LoggerFactory.getLogger(RestAuthenticationEntryPoint.class);

    public TokenProvider(AppConfig appConfig) {
        super();
        this.appConfig = appConfig;
        this.key = Keys.hmacShaKeyFor(appConfig.getTokenSecret().getBytes(StandardCharsets.UTF_8));

    }

    public String createToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appConfig.getTokenExpirationMsec());
        return Jwts.builder()
                .setSubject(String.valueOf(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
   }

    public long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(this.key)
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(key).parseClaimsJws(authToken);
            logger.info("Using JWT secret: {}", appConfig.getTokenSecret());
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }

}
