package com.smartfood.controller;

import com.smartfood.util.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;

@RestController
@RequestMapping("/v1")
public class UploadController {

    private static final Path UPLOAD_DIR = Paths.get("uploads");

    @PostMapping(value = "/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return ApiResponse.error("No file provided");
        }

        Files.createDirectories(UPLOAD_DIR);

        String original = file.getOriginalFilename();
        String safeName = (original == null ? "file" : original.replaceAll("[^a-zA-Z0-9._-]", "_"));
        String filename = Instant.now().toEpochMilli() + "_" + safeName;
        Path target = UPLOAD_DIR.resolve(filename);
        Files.copy(file.getInputStream(), target);

        String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/uploads/")
            .path(filename)
            .toUriString();

        return ApiResponse.success(fileUri, fileUri);
    }
}
