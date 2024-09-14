package ma.morwork.modele;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class City implements Serializable{
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	@ManyToOne
	@JoinColumn(name = "region_id")
	private Region region;

	@JsonIgnore
	@OneToMany(mappedBy = "city")
	private List<Education> educations;
	@JsonIgnore
	@OneToMany(mappedBy = "city")
	private List<Experience> experiences;
	@JsonIgnore
	@OneToMany(mappedBy = "city")
	private List<JobPost> jobs;
	@JsonIgnore
	@OneToMany(mappedBy = "headquarters")
	private List<Company> companies;
}