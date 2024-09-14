package ma.morwork.conversion;

import lombok.RequiredArgsConstructor;
import ma.morwork.config.ServerMedia;
import ma.morwork.dto.*;
import ma.morwork.modele.Post;
import ma.morwork.modele.Repost;
import ma.morwork.modele.StandartPost;
import ma.morwork.modele.User;
import ma.morwork.repository.PostRepository;
import ma.morwork.repository.RepostRepository;
import ma.morwork.service.PostService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserConversion {
    private final ModelMapper modelMapper;
    private final ServerMedia serverMedia;
    private final PostRepository postRepository;
    private final RepostRepository repostRepository;
    private final PostService postService;

    public UserDTO entityToDTO(User user) {
        List<StandartPost> standartPosts = postRepository.findAllByAuthorId(user.getId());
        List<Repost> reposts = repostRepository.findAllByAuthorId(user.getId());
        List<Post> combinedPosts = new ArrayList<>();
        combinedPosts.addAll(standartPosts);
        combinedPosts.addAll(reposts);
        List<PostDTO> posts = combinedPosts.stream()
                .map(postService::convertToDTO)
                .toList();
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        try {
            userDTO.setPosts(posts);
            userDTO.setCoverPicture(serverMedia.serveMedia(userDTO.getCoverPicture()));
            userDTO.setProfilePicture(serverMedia.serveMedia(userDTO.getProfilePicture()));

            List<ExperienceDTO> experiences = userDTO.getExperiences();
            for (ExperienceDTO experience : experiences) {
                CompanyDTO company = experience.getCompany();
                if (company != null)
                    company.setImage(serverMedia.serveMedia(company.getImage()));
                else if (experience.getImage() != null) {
                    experience.setImage(serverMedia.serveMedia(experience.getImage()));
                }

                experience.setCompany(company);
            }
            userDTO.setExperiences(experiences);

            List<EducationDTO> educations = userDTO.getEducation();
            for (EducationDTO education : educations) {
                CompanyDTO company = education.getCompany();
                if (company != null)
                    company.setImage(serverMedia.serveMedia(company.getImage()));
                else if (education.getImage() != null) {
                    education.setImage(serverMedia.serveMedia(education.getImage()));
                }

                education.setCompany(company);
            }
            userDTO.setEducation(educations);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return userDTO;
    }
}
