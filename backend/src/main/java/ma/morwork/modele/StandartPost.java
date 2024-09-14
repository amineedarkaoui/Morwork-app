package ma.morwork.modele;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StandartPost extends Post implements Serializable{
	

	private String content;
	private String image;
	private String video;


	@OneToMany(mappedBy = "originalPost", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Repost> reposts;
	
	@OneToMany(mappedBy = "post")
	@JsonIgnore
	private List<PostLike> likes;
	
	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Comment> comments;

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<CommentLike> commentLikes = new ArrayList<>();

	public String toString() {
		return "content: " + content;
	}
}
