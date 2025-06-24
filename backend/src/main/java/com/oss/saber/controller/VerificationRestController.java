package com.oss.saber.controller;

import com.oss.saber.domain.Verification;
import com.oss.saber.domain.VerificationResult;
import com.oss.saber.dto.VerificationSubmitRequest;
import com.oss.saber.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "세부 인증 진행 API", description = "")
public class VerificationRestController {

    private final VerificationService verificationService;

    @PostMapping("/verification/{verificationId}/start")
    @Operation(summary = "세부 인증 시작", description = "세부 인증을 시작합니다.")
    public ResponseEntity<String> startVerification(@PathVariable Long verificationId) {
        verificationService.startVerification(verificationId);
        return ResponseEntity.ok("인증을 시작합니다.");
    }

    @PostMapping("/verifications/{id}/submit")
    @Operation(summary = "세부 인증 제출", description = "세부 인증 내용을 제출합니다.")
    public ResponseEntity<String> submitVerification(@PathVariable Long id, @RequestBody VerificationSubmitRequest request) {
        Verification verification = verificationService.submitResult(id, request);

        if(verification.getResult()== VerificationResult.SUBMITTED){
            return ResponseEntity.ok("제출에 성공했습니다.");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/verifications/{id}/photo")
    @Operation(summary = "인증 사진 조회", description = "인증에 저장된 사진 URL을 반환합니다.")
    public ResponseEntity<String> getVerificationPhoto(@PathVariable Long id) {
        Verification verification = verificationService.findById(id);
        if (verification == null) {
            return ResponseEntity.notFound().build();
        }
        String photoUrl = verification.getImageUrl(); // DB에 저장된 URL
        return ResponseEntity.ok(photoUrl);
    }
}
