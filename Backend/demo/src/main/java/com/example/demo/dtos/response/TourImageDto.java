package com.example.demo.dtos.response;

public class TourImageDto {
    private String imagesBase64;
    private String contentType;

    public String getImagesBase64() {
        return imagesBase64;
    }

    public void setImagesBase64(String imagesBase64) {
        this.imagesBase64 = imagesBase64;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}