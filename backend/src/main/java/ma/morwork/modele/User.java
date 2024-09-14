package ma.morwork.modele;

import java.io.Serializable;
import java.sql.Date;
import java.util.Collection;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.TABLE)
	private long id;
	private String firstName;
	private String lastName;

	@Column(unique = true)
	private String email;

	private String password;
	@Column(unique = true)
	private String username;

	@Column(columnDefinition = "varchar(255) default 'avatar.jpg'")
	private String profilePicture;

	@Column(columnDefinition = "varchar(255) default 'cover.jpg'")
	private String coverPicture;
	private String title;
	@Lob
	@Column(length = 512)
	private String about;

    @JsonIgnore
	@OneToMany(mappedBy = "followed", cascade = CascadeType.REMOVE)
	private List<Following> followers;

    @JsonIgnore
	@OneToMany(mappedBy = "follower", cascade = CascadeType.REMOVE)
	private List<Following> following;

	@Transient
	private int followersNum;
	@Transient
	private int followingNum;

	@CreatedDate
	private Date date;

    @JsonIgnore
	@OneToMany(mappedBy = "blocked", cascade = CascadeType.REMOVE)
	private List<Blocked> blocked;

    @JsonIgnore
	@ManyToMany
	@JoinTable(name = "user_skills",
	joinColumns = @JoinColumn(name = "user_id"),
	inverseJoinColumns = @JoinColumn(name = "skill_id"))
	private List<Skill> skills;

    @JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
	private List<Experience> experiences;

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
	private List<Education> education;

    @JsonIgnore
	@OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE)
	private List<Post> posts;

	@OneToMany
	@JsonManagedReference
	private List<CommentLike> commentLikes;

	@OneToMany
	@JsonManagedReference
	private List<Reply> replies;
    @ManyToOne
    @JoinColumn(name = "company")
    private Company company;
	@OneToMany(cascade = CascadeType.REMOVE)
	@JsonIgnore
	private List<Notification> notifications;
	@Column(columnDefinition = "boolean default false")
	private boolean signedUp;


	public int getFollowersNum() {
		if (followers != null) {
			return followers.size();
		}else {
			return 0;
		}
	}

	public int getFollowingNum() {
		if (followers != null) {
			return followers.size();
		}else {
			return 0;
		}
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
