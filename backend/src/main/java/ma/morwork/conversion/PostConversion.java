package ma.morwork.conversion;

import ma.morwork.dto.StandartPostDTO;
import ma.morwork.modele.Post;

public class PostConversion {
    public StandartPostDTO entityToDTO(Post post) {
        return (new StandartPostDTO());
    }
}
