package ma.morwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.StandartPost;
import ma.morwork.modele.User;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostLikeDTO {
    private Long id;
    private User user;
    private LocalDateTime date;
    private Long postId;
}
