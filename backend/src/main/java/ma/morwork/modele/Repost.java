package ma.morwork.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.*;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Repost extends Post implements Serializable {
    @ManyToOne
    private StandartPost originalPost;

    @OneToMany(mappedBy = "post")
    @JsonIgnore
    private List<PostLike> likes;

    @OneToMany(mappedBy = "post")
    @JsonIgnore
    private List<Save> saves = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CommentLike> commentLikes = new ArrayList<>();
    private String firstName;
    private String lastName;
    private String title;



}
