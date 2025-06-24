package com.oss.saber.service;

import com.oss.saber.domain.Verification;
import com.oss.saber.domain.VerificationLink;
import com.oss.saber.domain.VerificationLinkStatus;
import com.oss.saber.domain.VerificationResult;
import com.oss.saber.dto.VerificationSubmitRequest;
import com.oss.saber.repository.VerificationLinkRepository;
import com.oss.saber.repository.VerificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final VerificationLinkRepository verificationLinkRepository;

    public Verification startVerification(Long verificationId) {
        Verification verification = verificationRepository.findById(verificationId).orElseThrow(()->new EntityNotFoundException("Verification not found"));
        verification.setResult(VerificationResult.IN_PROGRESS);
        return verificationRepository.save(verification);
    }

    public Verification submitResult(Long verificationId, VerificationSubmitRequest request) {
        Verification verification = verificationRepository.findById(verificationId).orElseThrow(() -> new EntityNotFoundException("해당 인증이 존재하지 않습니다."));

        verification.setImageUrl(request.getFileUrl());
        verification.setComment(request.getComment());
        verification.setResult(VerificationResult.SUBMITTED);
        verification.setSubmittedAt(LocalDateTime.now());

        verificationRepository.save(verification);

        updateVerificationLinkStatusIfAllSubmitted(verification.getVerificationLink().getId());
        return verification;
    }

    public void updateVerificationLinkStatusIfAllSubmitted(Long linkId) {
        VerificationLink link = verificationLinkRepository.findById(linkId)
                .orElseThrow(() -> new EntityNotFoundException("해당 인증 링크가 존재하지 않습니다."));

        List<Verification> verifications = link.getVerifications();

        boolean allSubmitted = verifications.stream()
                .allMatch(v -> v.getResult() == VerificationResult.SUBMITTED);

        if (allSubmitted) {
            link.setStatus(VerificationLinkStatus.COMPLETED);
            verificationLinkRepository.save(link);
        }
    }

    public Verification findById(Long id) {
        return verificationRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Verification not found"));
    }
}
