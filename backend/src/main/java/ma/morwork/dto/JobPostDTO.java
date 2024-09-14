package ma.morwork.dto;


import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.City;
import ma.morwork.modele.Company;
import ma.morwork.modele.JobType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobPostDTO {
    private Long id;
    private double salary;
    private String title;
    private String description;
    private JobTypeDTO jobType;
    private CityDTO city;
    private CompanyDTO company;
    private boolean isExpired;
}
