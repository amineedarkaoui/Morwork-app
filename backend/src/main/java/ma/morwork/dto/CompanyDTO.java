package ma.morwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.City;
import org.springframework.beans.factory.annotation.Value;

import java.sql.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyDTO {
    private Long id;
    private String name;
    private Date creationDate;
    private IndustryDTO industry;
    private String description;
    private int employesNum;
    private String image;
    private String type;
    private String cover;
    private CityDTO headquarters;
    private String tagline;
}
