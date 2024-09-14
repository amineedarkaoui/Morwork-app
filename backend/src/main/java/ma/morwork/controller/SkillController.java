package ma.morwork.controller;

import lombok.RequiredArgsConstructor;
import ma.morwork.dto.SkillDTO;
import ma.morwork.service.SkillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("morwork/api/v1/skills")
@CrossOrigin
@RequiredArgsConstructor
public class SkillController {
    public final SkillService skillService;
    @GetMapping("/get-all-skills")
    public ResponseEntity<?> getAllSkills() {
        try {
            return ResponseEntity.ok(skillService.getAllSkills());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/update-user-skills")
    public ResponseEntity<?> updateUserSkills(@RequestParam("userId") long userId,
                            @RequestBody List<SkillDTO> skills) {
        try {
            skillService.updateUserSkills(userId, skills);
            return ResponseEntity.ok("User skills have been updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
}
