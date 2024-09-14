package ma.morwork.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.PostType;
import ma.morwork.modele.Report;
import ma.morwork.modele.Save;
import ma.morwork.modele.User;

import java.time.LocalDateTime;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private Long id;
    private LocalDateTime date;
    private Long userId;
    private List<Report> reports;
    private List<Save> saves;
    private PostType type;
    private String userProfilePicture;


}
