package ma.morwork.repository;

import ma.morwork.modele.Following;
import ma.morwork.modele.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowingRepository extends JpaRepository<Following, Long> {
    Following findByFollowerAndFollowed(User follower, User followed);
}
