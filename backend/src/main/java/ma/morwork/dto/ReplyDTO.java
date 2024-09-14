package ma.morwork.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.Comment;
import ma.morwork.modele.ReplayLike;
import ma.morwork.modele.User;

import java.time.LocalDateTime;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReplyDTO {

    private Long id;
    private String content;
    private LocalDateTime date;
    private Comment comment;
    private User user;
    private List<ReplayLike> likes;
}
