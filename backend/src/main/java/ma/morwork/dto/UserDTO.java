package ma.morwork.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String profilePicture;
    private String coverPicture;
    private String title;
    private String about;
    private int followersNum;
    private CompanyDTO company;
    private List<SkillDTO> skills;
    private List<ExperienceDTO> experiences;
    private List<PostDTO> posts;
    private List<EducationDTO> education;
}
