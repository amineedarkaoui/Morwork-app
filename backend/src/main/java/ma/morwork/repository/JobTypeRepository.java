package ma.morwork.repository;

import ma.morwork.modele.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface JobTypeRepository extends JpaRepository<JobType, Long> {
}
