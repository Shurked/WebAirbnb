package com.example.demo.utils;

import com.example.demo.dtos.response.*;
import com.example.demo.models.*;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Base64;
import java.util.Set;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration()
            .setMatchingStrategy(MatchingStrategies.STANDARD);

        // Converter para transformar byte[] a base64 String
        Converter<byte[], String> byteArrayToBase64 = ctx -> {
            byte[] src = ctx.getSource();
            if (src == null || src.length == 0) return "";
            return Base64.getEncoder().encodeToString(src);
        };

        // Converter explícito para convertir User a Boolean para setHost()
        Converter<User, Boolean> isHostConverter = new Converter<User, Boolean>() {
            @Override
            public Boolean convert(MappingContext<User, Boolean> context) {
                User user = context.getSource();
                if (user == null) return false;
                Set<String> roles = user.getRoles();
                return roles != null && roles.contains("ROLE_HOST");
            }
        };

        // Mapeo AccommodationImage → AccommodationImageDto
        modelMapper.typeMap(AccommodationImage.class, AccommodationImageDto.class)
            .addMappings(mapper -> {
                mapper.using(byteArrayToBase64)
                      .map(AccommodationImage::getData, AccommodationImageDto::setImagesBase64);
                mapper.map(AccommodationImage::getContentType, AccommodationImageDto::setContentType);
            });

        // Mapeo User → UserProfileDto (para el campo host)
        modelMapper.typeMap(User.class, UserProfileDto.class)
            .addMappings(mapper -> {
                mapper.map(User::getId, UserProfileDto::setId);
                mapper.map(User::getName, UserProfileDto::setName);
                mapper.map(User::getEmail, UserProfileDto::setEmail);
                mapper.map(User::getAvatarUrl, UserProfileDto::setAvatar);
                // Usa converter explícito para setHost(boolean)
                mapper.using(isHostConverter).map(src -> src, UserProfileDto::setHost);
            });

        // Mapeo Accommodation → AccommodationDetailDto
        modelMapper.typeMap(Accommodation.class, AccommodationDetailDto.class)
            .addMappings(mapper -> {
                // Las imágenes se mapearán automáticamente
                // El host (User) se mapea con el typeMap definido arriba
            });

        // Mapeo Accommodation → AccommodationCardDto
        modelMapper.typeMap(Accommodation.class, AccommodationCardDto.class)
            .addMappings(mapper -> {
                mapper.map(src -> src.getHost().getName(), AccommodationCardDto::setHostName);
                mapper.map(src -> {
                    if (src.getImages() != null && !src.getImages().isEmpty()) {
                        AccommodationImage image = src.getImages().get(0);
                        return "data:" + image.getContentType() + ";base64," +
                               Base64.getEncoder().encodeToString(image.getData());
                    }
                    return "";
                }, AccommodationCardDto::setMainImage);
            });

        // Mapeo TourImage → TourImageDto (nuevo)
        modelMapper.typeMap(TourImage.class, TourImageDto.class)
            .addMappings(mapper -> {
                mapper.using(byteArrayToBase64)
                      .map(TourImage::getData, TourImageDto::setImagesBase64);
                mapper.map(TourImage::getContentType, TourImageDto::setContentType);
            });

        // Mapeo TourService → TourServiceResponse (nuevo)
        modelMapper.typeMap(TourService.class, TourServiceResponse.class)
            .addMappings(mapper -> {
                mapper.map(src -> src.getHost().getName(), TourServiceResponse::setHostName);
                // Las imágenes se mapean automáticamente a TourImageDto
            });

        return modelMapper;
    }
}
