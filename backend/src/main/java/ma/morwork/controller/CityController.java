package ma.morwork.controller;

import lombok.RequiredArgsConstructor;
import ma.morwork.service.CityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("morwork/api/v1/city")
@CrossOrigin
@RequiredArgsConstructor
public class CityController {
    public final CityService cityService;

    @GetMapping("/get-all-cities")
    public ResponseEntity<?> getAllCities() {
        try {
            return ResponseEntity.ok(cityService.getAllCities());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
}
