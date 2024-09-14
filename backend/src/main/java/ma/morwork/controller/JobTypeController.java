package ma.morwork.controller;


import lombok.RequiredArgsConstructor;
import ma.morwork.dto.ApplyDTO;
import ma.morwork.service.CompanyService;
import ma.morwork.service.JobTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("morwork/api/v1/job-type")
@CrossOrigin
@RequiredArgsConstructor
public class JobTypeController {
    public final JobTypeService jobTypeService;

    @GetMapping("/get-all-job-types")
    public ResponseEntity<?> getAllJobTypes() {
        try {
            return ResponseEntity.ok(jobTypeService.getAllJobTypes());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PostMapping("/new-apply")
    public void  applyNow(@RequestParam String description, @RequestParam Long userId, @RequestParam Long jobId){
        jobTypeService.addApply(description,userId, jobId);
    }
    @GetMapping("/applies")
    public List<ApplyDTO> getApplies(){
        return jobTypeService.getAllApplies();
    }
    @GetMapping("/applies/{id}")
    public ResponseEntity<?> getAppliesByJobId(@PathVariable Long id){
        return ResponseEntity.ok(jobTypeService.getAppliesByJobId(id));
    }
}
