package ma.morwork.dto;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.City;
import ma.morwork.modele.Company;
import ma.morwork.modele.JobType;
import ma.morwork.modele.User;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExperienceDTO {
    private Long id;
    private String title;
    private String description;
    private Date startDate;
    private Date endDate;
    private CompanyDTO company;
    private String companyLabel;
    private String image;
    private CityDTO city;
    private JobTypeDTO jobType;
}
