package ma.morwork.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.*;
import ma.morwork.modele.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RepostDTO extends PostDTO{
    private StandartPostDTO originalPost;
    private List<Repost> reposts = new ArrayList<>();
    private List<PostLike> likes = new ArrayList<>();
    private List<CommentDTO> comments = new ArrayList<>();
    private List<Save> saves = new ArrayList<>();
    private String firstName;
    private String lastName;
    private String title;


}
