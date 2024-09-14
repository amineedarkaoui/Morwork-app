package ma.morwork.repository;

import ma.morwork.modele.Apply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplyRepository extends JpaRepository<Apply, Long> {
    List<Apply> findByJobPostId(Long id);
}
