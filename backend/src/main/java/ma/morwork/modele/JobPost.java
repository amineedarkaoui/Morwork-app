package ma.morwork.modele;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPost extends Post implements Serializable{
	private double salary;
	private String title;
	private String description;
	@ManyToOne
	@JoinColumn(name = "type_id")
	private JobType jobType;
	
	@ManyToOne
	@JoinColumn(name = "city_id")
	private City city;
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
	@Column(columnDefinition = "boolean default false")
	private boolean isExpired;
}
