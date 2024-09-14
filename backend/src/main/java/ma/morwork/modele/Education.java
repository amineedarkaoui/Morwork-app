package ma.morwork.modele;

import java.io.Serializable;
import java.sql.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Education implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String school;
	private String degree;
	private Date startDate;
	private Date endDate;
	private String fieldOfStudy;
	@ManyToOne
	@JoinColumn(name = "city_id")
	private City city;
	private String description;
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;
	@ManyToOne
	@JoinColumn(name="company_id")
	private Company company;
	private String image;
	
	
}
