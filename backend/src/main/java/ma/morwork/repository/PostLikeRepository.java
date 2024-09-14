package ma.morwork.repository;

import ma.morwork.dto.PostLikeDTO;
import ma.morwork.modele.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    public List<PostLike> findAllByPostId(Long id);

}
