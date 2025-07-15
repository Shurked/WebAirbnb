package com.example.demo.config;

import com.example.demo.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ CORS habilitado
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/accommodations/**").hasAnyRole("USER", "HOST")
                .requestMatchers(HttpMethod.POST, "/accommodations").hasRole("HOST")
                .requestMatchers(HttpMethod.GET, "/accommodations/featured").permitAll()
                .requestMatchers(HttpMethod.GET, "/accommodations/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/accommodations/*").permitAll()

                .requestMatchers(HttpMethod.GET, "/favorites/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST, "/favorites/**").hasRole("USER")
                .requestMatchers(HttpMethod.DELETE, "/favorites/**").hasRole("USER")

                .requestMatchers(HttpMethod.GET, "/bookings/**").hasRole("USER")
                .requestMatchers(HttpMethod.POST, "/bookings/**").hasRole("USER")
                .requestMatchers(HttpMethod.DELETE, "/bookings/**").hasRole("USER")

                .requestMatchers(HttpMethod.GET, "/tours/location").permitAll()
                .requestMatchers(HttpMethod.GET, "/tours/host").permitAll()
                .requestMatchers(HttpMethod.POST, "/tours").hasRole("HOST")
                .requestMatchers(HttpMethod.DELETE, "/tours/**").hasRole("HOST")
                .requestMatchers(HttpMethod.POST, "/tours/*/images").hasRole("HOST")

                .requestMatchers( "/trip-plans/**").hasAnyRole("USER", "HOST")
                .requestMatchers( "/travel-routes").hasAnyRole("USER", "HOST")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // 🚀 tu frontend Vite
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // necesario para enviar cookies o headers Authorization

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
