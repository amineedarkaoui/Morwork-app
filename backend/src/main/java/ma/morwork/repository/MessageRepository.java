package ma.morwork.repository;

import ma.morwork.modele.Message;
import ma.morwork.modele.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT e FROM Message e WHERE (e.sender.id = :senderId AND e.receiver.id = :receiverId) OR (e.sender.id = :receiverId AND e.receiver.id = :senderId) ORDER BY e.date Asc")
    List<Message> getUserChat(long receiverId, long senderId);

    @Query("SELECT e.sender FROM Message e WHERE e.date IN " +
            "(SELECT MAX(m.date) FROM Message m WHERE m.receiver.id = :id OR m.sender.id = :id GROUP BY m.sender.id, m.receiver.id) " +
            "ORDER BY e.date DESC")
    List<User> getUserSenders(long id);

    @Query("SELECT e FROM Message e WHERE (e.sender.id = :senderId AND e.receiver.id = :receiverId) OR (e.sender.id = :receiverId AND e.receiver.id = :senderId) ORDER BY e.date DESC LIMIT 1")
    Message getUserLastMessage(long receiverId, long senderId);
}
