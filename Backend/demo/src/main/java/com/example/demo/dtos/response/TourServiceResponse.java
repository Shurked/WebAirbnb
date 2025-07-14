package com.example.demo.dtos.response;

import lombok.Data;
import java.util.List;

@Data
public class TourServiceResponse {
    private Long id;
    private String title;
    private String description;
    private double price;
    private String location;
    private String hostName;
     // Lista de imágenes en base64
    private List<TourImageDto> images;
}
