package ma.morwork.controller;

import lombok.RequiredArgsConstructor;
import ma.morwork.dto.EducationDTO;
import ma.morwork.dto.ExperienceDTO;
import ma.morwork.service.EducationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("morwork/api/v1/education")
@CrossOrigin
@RequiredArgsConstructor
public class EducationController {
    private  final EducationService educationService;

    @PutMapping("/delete-education")
    public ResponseEntity<?> deleteEducation(@RequestParam("id") long id) {
        try {
            educationService.deleteEducation(id);
            return ResponseEntity.status(HttpStatus.OK).body("Education was deleted succesfully successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/update-education")
    public ResponseEntity<?> updateExperience(@RequestBody EducationDTO educationDTO) {
        try {
            educationService.updateEducation(educationDTO);
            return ResponseEntity.status(HttpStatus.OK).body("Education was updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
}
