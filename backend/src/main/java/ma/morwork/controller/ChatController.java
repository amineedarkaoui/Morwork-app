package ma.morwork.controller;

import lombok.RequiredArgsConstructor;
import ma.morwork.modele.Message;
import ma.morwork.repository.MessageRepository;
import ma.morwork.service.MessageService;
import ma.morwork.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/morwork/api/v1/message")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {
    private final MessageService messageService;
    private final UserService userService;
    private final MessageRepository messageRepository;

    @GetMapping("/get-chat-users")
    public ResponseEntity<?> getChatUsers(@RequestParam("id") long receiverId) {
        try {
            return ResponseEntity.ok(userService.getChatUsersList(receiverId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PostMapping("/send-message")
    public ResponseEntity<?> sendMessage(@RequestParam("receiverId") long receiverId,
                                          @RequestParam("senderId") long senderId,
                                          @RequestParam("content") String content) {
        try {
            messageService.sendMessage(receiverId, senderId, content);
            return ResponseEntity.ok("Message sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/get-user-chat")
    public ResponseEntity<?> getUserChat(@RequestParam("receiverId") long receiverId,
                                         @RequestParam("senderId") long senderId) {
        try {
            return ResponseEntity.ok(messageService.getUserChat(receiverId, senderId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/get-user-last-message")
    public ResponseEntity<?> getUserLastMessage(@RequestParam("receiverId") long receiverId,
                                         @RequestParam("senderId") long senderId) {
        try {
            return ResponseEntity.ok(messageRepository.getUserLastMessage(receiverId, senderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
}
