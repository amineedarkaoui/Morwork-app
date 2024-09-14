package ma.morwork.repository;

import ma.morwork.modele.Repost;
import ma.morwork.modele.StandartPost;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepostRepository extends JpaRepository<Repost, Long> {
    List<Repost> findAllByOriginalPostId(Long id);
    List<Repost> findAllByAuthorId(Long id);
    List<Repost> findByOriginalPostContentContainingIgnoreCase(Sort sort, String keyword);
}
