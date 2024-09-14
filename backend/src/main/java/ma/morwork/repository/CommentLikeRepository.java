package ma.morwork.repository;

import ma.morwork.dto.CommentLikeDTO;
import ma.morwork.modele.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentLikeRepository extends JpaRepository<CommentLike,Long> {
    List<CommentLike> findAllByPostId(Long id);
}
