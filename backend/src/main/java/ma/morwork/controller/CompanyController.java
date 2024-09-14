package ma.morwork.controller;

import lombok.RequiredArgsConstructor;
import ma.morwork.config.ServerMedia;
import ma.morwork.dto.CompanyDTO;
import ma.morwork.service.CompanyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ma.morwork.service.CompanyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("morwork/api/v1/company")
@CrossOrigin
@RequiredArgsConstructor
public class CompanyController {
    public final CompanyService companyService;
    public final ServerMedia serverMedia;

    @GetMapping("/get-all-companies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            return ResponseEntity.ok(companyService.getAllCompanies());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/get-all-schools")
    public ResponseEntity<?> getAllSchools() {
        try {
            return ResponseEntity.ok(companyService.getAllSchools());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/get-default-logo")
    public ResponseEntity<?> getDefaultLogo(@RequestParam("type") String type) {
        try {
            return ResponseEntity.ok(companyService.getDefaultLogo(type));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/get-default-cover")
    public ResponseEntity<?> getDefaultCover() {
        try {
            return ResponseEntity.ok(serverMedia.serveMedia("cover.jpg"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
    @PostMapping("/add-new-organization")
    public ResponseEntity<?> addNewOrganization(@RequestParam("userId") Long userId,
                                                @RequestBody CompanyDTO company) {
        try {
            return ResponseEntity.ok(companyService.addNewOrganization(userId, company));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("update-company-image")
    public ResponseEntity<?> updateCompanyImage(@RequestParam("id") Long id,
                                                @RequestParam("image") MultipartFile image) {
        try {
            companyService.updateCompanyImage(id, image);
            return ResponseEntity.ok("Company image has been updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("update-company-cover")
    public ResponseEntity<?> updateCompanyCover(@RequestParam("id") Long id,
                                                @RequestParam("cover") MultipartFile cover) {
        try {
            companyService.updateCompanyCover(id, cover);
            return ResponseEntity.ok("Company cover has been updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/delete-image")
    public ResponseEntity<?> deleteImage(@RequestParam("id") long id) {
        try {
            companyService.deleteImage(id);
            return ResponseEntity.status(HttpStatus.OK).body("Organization's logo has been deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/delete-cover")
    public ResponseEntity<?> deleteCover(@RequestParam("id") long id) {
        try {
            companyService.deleteCover(id);
            return ResponseEntity.status(HttpStatus.OK).body("Organization's cover picture has been deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/update-description")
    public ResponseEntity<?> updateDescription(@RequestParam("id") long id,
                                         @RequestParam("content") String content) {
        try {
            companyService.updateDescription(id, content);
            return ResponseEntity.status(HttpStatus.OK).body("Organization's description has been updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/update-info")
    public ResponseEntity<?> updateInfo(@RequestBody CompanyDTO companyDTO) {
        try {
            companyService.updateInfo(companyDTO);
            return ResponseEntity.status(HttpStatus.OK).body("Organization's info have been updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/get-company")
    public ResponseEntity<?> getCompany(@RequestParam("id") long id) {
        try {
            return ResponseEntity.ok(companyService.getCompany(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
}
