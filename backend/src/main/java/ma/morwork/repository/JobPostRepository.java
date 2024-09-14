package ma.morwork.repository;

import ma.morwork.modele.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    List<JobPost> findByTitleContainingIgnoreCase(String keyWord);
}
