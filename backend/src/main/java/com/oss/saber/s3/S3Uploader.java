package com.oss.saber.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Uploader {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public String uploadFile(String fileName, MultipartFile multipartFile) throws IOException {
        String key = "uploads/" + UUID.randomUUID() + "_" + fileName;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(multipartFile.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(multipartFile.getBytes()));

        return s3Client.utilities().getUrl(GetUrlRequest.builder()
                .bucket(bucket)
                .key(key)
                .build()).toExternalForm();
    }
}

