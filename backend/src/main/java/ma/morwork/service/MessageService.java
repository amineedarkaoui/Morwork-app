package ma.morwork.service;

import lombok.RequiredArgsConstructor;
import ma.morwork.modele.Message;
import ma.morwork.modele.User;
import ma.morwork.repository.MessageRepository;
import ma.morwork.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<Message> getUserChat(long receiverId, long senderId) throws Exception {
        return messageRepository.getUserChat(
                receiverId,
                senderId
        );
    }

    public void sendMessage(long receiverId, long senderId, String content) throws Exception {
        Message message = Message.builder()
                .receiver(userRepository.findById(receiverId).get())
                .sender(userRepository.findById(senderId).get())
                .content(content)
                .build();
        messageRepository.save(message);
    }
}
