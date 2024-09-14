package ma.morwork.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private Long id;

    private String content;

    private LocalDateTime date;


    private User user;


    private Post post;


    private List<ReplyDTO> replies;

    private List<CommentLike> likes;
}
