package ma.morwork.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.Comment;
import ma.morwork.modele.Post;
import ma.morwork.modele.StandartPost;
import ma.morwork.modele.User;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentLikeDTO {
    private Long id;
    private User user;
    private Comment comment;
    private LocalDateTime date;
    private Post post;
    private List<CommentLikeDTO> likes;
}
