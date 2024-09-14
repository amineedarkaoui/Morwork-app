package ma.morwork.controller;


import lombok.RequiredArgsConstructor;
import ma.morwork.service.IndustryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("morwork/api/v1/industry")
@CrossOrigin
@RequiredArgsConstructor
public class IndustryController {
    public final IndustryService industryService;
    @GetMapping("/get-all-industries")
    public ResponseEntity<?> getAllIndustries() {
        try {
            return ResponseEntity.ok(industryService.getAllIndustries());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
}
