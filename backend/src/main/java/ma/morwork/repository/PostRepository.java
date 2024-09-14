package ma.morwork.repository;


import java.util.List;
import java.util.Optional;

import ma.morwork.modele.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.morwork.modele.StandartPost;

@Repository
public interface PostRepository extends JpaRepository<StandartPost, Long>{
    List<StandartPost> findAllByAuthorId(Long id);
    List<StandartPost> findByContentContainingIgnoreCase(Sort sort, String keyWord);
}
