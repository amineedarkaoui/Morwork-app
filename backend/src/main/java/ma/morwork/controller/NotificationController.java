package ma.morwork.controller;

import ma.morwork.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/morwork/api/v1/notification")
@CrossOrigin(origins = "*")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getNotificationsByUserId(@PathVariable Long userId){
        return ResponseEntity.ok(notificationService.getNotificationByUserId(userId));
    }

    @PutMapping("/notif")
    public ResponseEntity<?> updateSeen(){
        notificationService.updateAllToSeen();
        return ResponseEntity.ok("seen");
    }
}