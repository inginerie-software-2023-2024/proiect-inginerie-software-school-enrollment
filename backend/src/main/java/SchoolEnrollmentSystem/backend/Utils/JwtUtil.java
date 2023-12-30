package SchoolEnrollmentSystem.backend.Utils;

import SchoolEnrollmentSystem.backend.persistence.Admin;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.service.AdminService;
import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;
import java.util.Date;
import java.util.concurrent.TimeUnit;


@Service
public class JwtUtil {
    @Autowired
    private AdminService adminService;
    private final String secret_key = "cheiesecreta";
    private long accessTokenValidity = 60*60*1000;

    private final JwtParser jwtParser = Jwts.parser().setSigningKey(secret_key);
    private final String TOKEN_HEADER = "Authorization";
    private final String TOKEN_PREFIX = "Bearer ";

    public String createToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("parent",user.isParent());
        claims.put("principal",user.isDirector());
        claims.put("teacher",user.isTeacher());
        Admin admin = adminService.findByUsername(user.getUsername());

        claims.put("admin", admin != null);
        Date tokenCreateTime = new Date();
        Date tokenValidity = new Date(tokenCreateTime.getTime() + TimeUnit.MINUTES.toMillis(accessTokenValidity));
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(tokenValidity)
                .signWith(SignatureAlgorithm.HS256, secret_key)
                .compact();
    }

    @Bean
    private BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    private Claims parseJwtClaims(String token) {
        return jwtParser.parseClaimsJws(token).getBody();
    }

    public Claims resolveClaims(String token) {
        try {
            if (token != null) {
                return parseJwtClaims(token);
            }
            return null;
        } catch (ExpiredJwtException ex) {
            throw ex;
        } catch (Exception ex) {
            throw ex;
        }
    }
    public String resolveToken(HttpServletRequest request) {

        String bearerToken = request.getHeader(TOKEN_HEADER);
        if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(TOKEN_PREFIX.length());
        }
        return null;
    }

    public boolean validateClaims(Claims claims) throws AuthenticationException {
        try {
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            throw e;
        }
    }
}