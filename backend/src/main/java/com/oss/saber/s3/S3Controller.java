package com.oss.saber.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class S3Controller {

    private final S3Uploader s3Uploader;

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String url = s3Uploader.uploadFile(file.getOriginalFilename(), file);
        return ResponseEntity.ok(url); // S3에 저장된 파일의 URL 반환
    }
}
