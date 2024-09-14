package ma.morwork.modele;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Company implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private Date creationDate;
	private int employesNum;
	private String image;
	private String type;
	private String cover;
	@Lob
	@Column(length = 1000)
	private String description;

	@ManyToOne
	@JoinColumn(name="industry_id")
	private Industry industry;
	private String tagline;

	@ManyToOne
	@JoinColumn(name="city_id")
	private City headquarters;

	@JsonIgnore
	@OneToMany(mappedBy = "company")
	private List<User> admin;
	@JsonIgnore
	@OneToMany(mappedBy = "company")
	private List<Education> educations;

	@JsonIgnore
	@OneToMany(mappedBy = "company")
	private List<JobPost> jobOffers;
}
