package ma.morwork.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCardResponse {
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String coverPicture;
    private String title;
}
