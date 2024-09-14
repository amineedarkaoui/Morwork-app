package ma.morwork.controller;


import lombok.RequiredArgsConstructor;
import ma.morwork.dto.ExperienceDTO;
import ma.morwork.repository.ExperienceRepository;
import ma.morwork.service.ExperienceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("morwork/api/v1/experience")
@CrossOrigin
@RequiredArgsConstructor
public class ExperienceController {
    private final ExperienceService experienceService;

    @PutMapping("/delete-experience")
    public ResponseEntity<?> deleteExperience(@RequestParam("id") long id) {
        try {
            experienceService.deleteExperience(id);
            return ResponseEntity.status(HttpStatus.OK).body("Experience was deleted succesfully successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/update-experience")
    public ResponseEntity<?> updateExperience(@RequestBody ExperienceDTO experienceDTO) {
        try {
            experienceService.updateExperience(experienceDTO);
            return ResponseEntity.status(HttpStatus.OK).body("Experience was updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
}
