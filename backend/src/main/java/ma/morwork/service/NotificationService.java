package ma.morwork.service;

import ma.morwork.modele.Action;
import ma.morwork.modele.Notification;
import ma.morwork.repository.CommentRepository;
import ma.morwork.repository.NotificationRepository;
import ma.morwork.repository.ReplyRepository;
import ma.morwork.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private PostService postService;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ReplyRepository replyRepository;

    public void sendNotification(Long userId, Long postId, String postType, Action action) {
        Notification notification = new Notification();
        notification.setAction(action);
        notification.setDate(LocalDateTime.now());
        notification.setSender(userService.getUserById(userId));

        if (postType.equals("STANDART_POST")) {
            notification.setReceiver(postService.getPostById(postId).get().getAuthor());
            notification.setTypeAffected("POST");
            notification.setPost(postService.getPostById(postId).get());
        } else if (postType.equals("REPOSTED")) {
            notification.setReceiver(postService.getRepostById(postId).get().getAuthor());
            notification.setTypeAffected("POST");
            notification.setPost(postService.getRepost(postId));
        } else if (postType.equals("COMMENT")) {
            notification.setReceiver(commentRepository.findById(postId).get().getUser());
            notification.setTypeAffected("COMMENT");
            notification.setComment(commentRepository.findById(postId).get());
            notification.setPost(commentRepository.findById(postId).get().getPost());
        } else if (postType.equals("REPLY")) {
            notification.setReceiver(replyRepository.findById(postId).get().getUser());
            notification.setTypeAffected("REPLY");
            notification.setReply(replyRepository.findById(postId).get());
            notification.setPost(replyRepository.findById(postId).get().getComment().getPost());
        }

        notification.setSeen(false);
        userService.getUserById(userId).getNotifications().add(notification);
        notificationRepository.save(notification);
    }


    public List<Notification> getNotificationByUserId(Long id){
        return  notificationRepository.findNotificationByReceiverId(id);
    }

    public void updateAllToSeen(){
        notificationRepository.updateAllToIsSeen();
    }
}
