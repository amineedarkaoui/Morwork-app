package ma.morwork.repository;

import jakarta.transaction.Transactional;
import ma.morwork.modele.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findNotificationByReceiverId(Long id);
    @Transactional
    @Modifying
    @Query("UPDATE Notification n SET n.isSeen = true")
    void updateAllToIsSeen();
}
