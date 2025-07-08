package com.example.demo.utils;

import com.example.demo.dtos.response.AccommodationCardDto;
import com.example.demo.dtos.response.AccommodationDetailDto;
import com.example.demo.models.Accommodation;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // Configuración específica para AccommodationCardDto
        modelMapper.addMappings(new PropertyMap<Accommodation, AccommodationCardDto>() {
            @Override
            protected void configure() {
                skip(destination.getMainImage());
            }
        });
        
        return modelMapper;
    }
}