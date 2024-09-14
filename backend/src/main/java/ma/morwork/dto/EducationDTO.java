package ma.morwork.dto;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.City;
import ma.morwork.modele.User;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EducationDTO {
    private Long id;
    private String school;
    private String degree;
    private Date startDate;
    private Date endDate;
    private String fieldOfStudy;
    private String description;
    private CityDTO city;
    private CompanyDTO company;
    private String image;
}
