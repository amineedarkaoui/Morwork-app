package ma.morwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.morwork.modele.JobPost;
import ma.morwork.modele.User;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplyDTO {

    private Long id;
    private User user;
    private JobPost jobPost;
    private String description;
    private LocalDateTime date;
}
