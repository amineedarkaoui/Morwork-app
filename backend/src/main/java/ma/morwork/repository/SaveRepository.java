package ma.morwork.repository;

import ma.morwork.modele.Save;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SaveRepository extends JpaRepository<Save, Long> {
    List<Save> findAllByPostId(Long postId);
    Save findByUserIdAndPostId(Long userId,Long postId);
}
