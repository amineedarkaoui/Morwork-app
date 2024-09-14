package ma.morwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.Repost;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StandartPostDTO extends PostDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String title;
    private String content;
    private String image;
    private String video;
    private List<RepostDTO> reposts;
    private List<PostLikeDTO> likes;
    private List<CommentDTO> comments;


}
