package ma.morwork.service;

import lombok.RequiredArgsConstructor;
import ma.morwork.config.ServerMedia;
import ma.morwork.dto.*;
import ma.morwork.modele.*;
import ma.morwork.repository.EducationRepository;
import ma.morwork.repository.ExperienceRepository;
import ma.morwork.repository.FollowingRepository;
import ma.morwork.repository.UserRepository;
import ma.morwork.dto.CompanyDTO;
import ma.morwork.dto.EducationDTO;
import ma.morwork.dto.ExperienceDTO;
import ma.morwork.dto.UserCardResponse;
import ma.morwork.modele.*;
import ma.morwork.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ServerMedia serverMedia;
    private final ModelMapper modelMapper;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final FollowingRepository followingRepository;
    private final MessageRepository messageRepository;
    private final CompanyRepository companyRepository;

    @Value("${media.directory}")
    private String MyDirectory;

    public UserCardResponse getUserCard(long userId) {
        User user = userRepository.getReferenceById(userId);
        return UserCardResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .title(user.getTitle())
                .profilePicture(serverMedia.serveMedia(user.getProfilePicture()))
                .coverPicture(serverMedia.serveMedia(user.getCoverPicture()))
                .build();
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return user;
    }

    public void updateProfilePicture(long userId, MultipartFile image) throws Exception {
        String originalFileName = image.getOriginalFilename();
        String fileName = serverMedia.addRandomSequence(originalFileName);

        String filePath = String.valueOf(Paths.get(MyDirectory, fileName));

        Files.write(Path.of(filePath), image.getBytes());

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User updatedUser = user.get();
            updatedUser.setProfilePicture(fileName);
            User userObj = userRepository.save(updatedUser);
        }

    }

    public void updateCoverPicture(long userId, MultipartFile image) throws Exception {
        String originalFileName = image.getOriginalFilename();
        String fileName = serverMedia.addRandomSequence(originalFileName);

        String filePath = String.valueOf(Paths.get(MyDirectory, fileName));

        Files.write(Path.of(filePath), image.getBytes());

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User updatedUser = user.get();
            updatedUser.setCoverPicture(fileName);
            User userObj = userRepository.save(updatedUser);
        }
    }

    public void updateAbout(long userId, String content) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User updatedUser = user.get();
            updatedUser.setAbout(content);
            userRepository.save(updatedUser);
        }
    }

    public void deleteProfilePicture(long userId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User updatedUser = user.get();
            updatedUser.setProfilePicture("avatar.jpg");
            userRepository.save(updatedUser);
        }
    }

    public void deleteCoverPicture(long userId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User updatedUser = user.get();
            updatedUser.setCoverPicture("cover.jpg");
            userRepository.save(updatedUser);
        }
    }

    public void addNewExperience(long userId, ExperienceDTO experienceDTO) throws Exception {
        if (experienceDTO.getCompany() == null) {
            experienceDTO.setImage("experience.jpg");
        }
        Experience experience = modelMapper.map(experienceDTO, Experience.class);
        experienceRepository.save(experience);

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User updatedUser = user.get();
            experience.setUser(updatedUser);
            List<Experience> experiences = updatedUser.getExperiences();
            experiences.add(experience);
            updatedUser.setExperiences(experiences);
            userRepository.save(updatedUser);
        }
    }

    public void addNewEducation(long userId, EducationDTO educationDTO) throws Exception {
        if (educationDTO.getCompany() == null) {
            educationDTO.setImage("education.jpg");
        }
        Education education = modelMapper.map(educationDTO, Education.class);
        educationRepository.save(education);

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User updatedUser = user.get();
            education.setUser(updatedUser);
            List<Education> educations = updatedUser.getEducation();
            educations.add(education);
            updatedUser.setEducation(educations);
            userRepository.save(updatedUser);
        }
    }

    public boolean getFollowStatus(Long userId, Long id) {
        Optional<User> user1 = userRepository.findById(userId);
        Optional<User> user2 = userRepository.findById(id);
        if (user1.isPresent() && user2.isPresent()){
            User source = user1.get();
            User destination = user2.get();
            List<Following> following = source.getFollowing();
            for (Following follow : following) {
                if (follow.getFollowed().equals(destination)) {
                    return true;
                }
            }
        }
        return false;
    }

    public void followUser(Long userId, Long id) throws Exception {
        Optional<User> user1 = userRepository.findById(userId);
        Optional<User> user2 = userRepository.findById(id);
        if (user1.isPresent() && user2.isPresent()){
            User follower = user1.get();
            User followed = user2.get();
            Following following = Following.builder()
                    .follower(follower)
                    .followed(followed)
                    .build();

            followingRepository.save(following);
        }
    }

    public void unfollowUser(Long userId, Long id) throws Exception {
        Optional<User> user1 = userRepository.findById(userId);
        Optional<User> user2 = userRepository.findById(id);
        if (user1.isPresent() && user2.isPresent()){
            User follower = user1.get();
            User followed = user2.get();

            Following following = followingRepository.findByFollowerAndFollowed(follower, followed);
            followingRepository.delete(following);
        }
    }

    public CompanyDTO getUserCompany(Long userId) throws Exception {
        User user = userRepository.findById(userId).get();
        if (user.getCompany() != null) {
            CompanyDTO userCompany = modelMapper.map(user.getCompany(), CompanyDTO.class);
            userCompany.setImage(serverMedia.serveMedia(userCompany.getImage()));
            userCompany.setCover(serverMedia.serveMedia(userCompany.getCover()));
            return userCompany;
        }
        else{
            return null;
        }

    }

    public boolean isUserAdmin(Long userId, Long id) {
        User user = userRepository.findById(userId).get();
        if (user.getCompany() == null) {
            return false;
        }
        return user.getCompany().getId() == id;
    }

    public void leaveOrganization(Long userId) {
        User user = userRepository.findById(userId).get();
        user.setCompany(null);
        userRepository.save(user);
    }

    public boolean isSignedUp(long userId) {
        User user = userRepository.findById(userId).get();
        return user.isSignedUp();
    }

    public void updateUserInfo(List<SkillDTO> skills, long userId, String about, String title) throws Exception {
        User user = userRepository.findById(userId).get();
        user.setTitle(title);
        user.setAbout(about);
        user.setSkills(
                skills.stream()
                        .map(skillDTO -> modelMapper.map(skillDTO, Skill.class))
                        .collect(toList())
        );
        user.setSignedUp(true);

        userRepository.save(user);
    }

    public List<User> searchUsers(String keyWord){
        return  userRepository.findByUsernameContainingIgnoreCase(keyWord);
    }
    public List<Company> searchCompany(String keyWord){
        return  companyRepository.findByNameContainingIgnoreCase(keyWord);
    }

    public List<UserDTO> getChatUsersList(long receiverId) throws Exception {
        // Get the list of users who have contacted the receiver
        List<User> contactedUsers = messageRepository.getUserSenders(receiverId);

        // Get the list of all users
        List<User> allUsers = userRepository.findAll();

        // Remove the receiver from the list of all users
        Optional<User> receiverOptional = userRepository.findById(receiverId);
        if (receiverOptional.isPresent()) {
            allUsers.remove(receiverOptional.get());
            contactedUsers.remove(receiverOptional.get());
        } else {
            throw new Exception("Receiver not found");
        }

        // Use a HashSet to store contacted users for O(1) lookup time
        Set<User> contactedUsersSet = new HashSet<>(contactedUsers);

        // Remove contacted users from the list of all users
        allUsers.removeAll(contactedUsersSet);

        // Add the remaining users (those who haven't contacted the receiver) to the contactedUsers list
        contactedUsers.addAll(allUsers);

        // Map users to UserDTO
        List<UserDTO> users = contactedUsers.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());

        // Set the profile picture for each user
        users.forEach(user -> user.setProfilePicture(serverMedia.serveMedia(user.getProfilePicture())));

        return users;
    }
}




