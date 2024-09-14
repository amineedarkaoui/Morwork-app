package ma.morwork.controller;

import lombok.RequiredArgsConstructor;
import ma.morwork.config.ServerMedia;
import ma.morwork.conversion.UserConversion;
import ma.morwork.dto.*;
import ma.morwork.modele.User;
import ma.morwork.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("morwork/api/v1/user")
@CrossOrigin
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final UserConversion userConversion;
    private final ServerMedia serverMedia;

    @GetMapping("/user-card")
    public ResponseEntity<?> getUserCard(@RequestParam long id) {
        try {
            return ResponseEntity.ok(userService.getUserCard(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("an error has occurred in the service");
        }
    }

    @GetMapping("/user-profile")
    public ResponseEntity<?> getUserProfile(@RequestParam long id) {
        try {
            User user = userService.getUserById(id);
            UserDTO userDTO = userConversion.entityToDTO(user);
;
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("an error has occurred in the service");
        }
    }

    @GetMapping("/user-photo")
    public ResponseEntity<?> getUserPhoto(@RequestParam long id) {
        try {
            User user = userService.getUserById(id);
            ImageDTO photo = new ImageDTO(serverMedia.serveMedia(user.getProfilePicture()));

            return ResponseEntity.ok(photo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("an error has occurred in the service");
        }
    }

    @PutMapping("/update-profile-picture")
    public ResponseEntity<?> updateProfilePicture(@RequestParam("userId") long userId,
                                                  @RequestParam("image") MultipartFile image) {
        try {
            userService.updateProfilePicture(userId, image);
            return ResponseEntity.status(HttpStatus.OK).body("photo updated succesfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }

    }

    @PutMapping("/update-cover-picture")
    public ResponseEntity<?> updateCoverPicture(@RequestParam("userId") long userId,
                                                  @RequestParam("image") MultipartFile image) {
        try {
            userService.updateCoverPicture(userId, image);
            return ResponseEntity.status(HttpStatus.OK).body("photo updated succesfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/update-about")
    public ResponseEntity<?> updateAbout(@RequestParam("userId") long userId,
                                         @RequestParam("content") String content) {
        try {
            userService.updateAbout(userId, content);
            return ResponseEntity.status(HttpStatus.OK).body("About section updated succesfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/delete-profile-picture")
    public ResponseEntity<?> deleteProfilePicture(@RequestParam("userId") long userId) {
        try {
            userService.deleteProfilePicture(userId);
            return ResponseEntity.status(HttpStatus.OK).body("Profile Picture deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/delete-cover-picture")
    public ResponseEntity<?> deleteCoverPicture(@RequestParam("userId") long userId) {
        try {
            userService.deleteCoverPicture(userId);
            return ResponseEntity.status(HttpStatus.OK).body("Cover Picture deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PostMapping("/add-new-experience")
    public ResponseEntity<?> addNewExperience(@RequestParam("userId") long userId,
                                              @RequestBody ExperienceDTO experienceDTO) {
        try {
            userService.addNewExperience(userId, experienceDTO);
            return ResponseEntity.status(HttpStatus.OK).body("Experience was added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
    @PostMapping("/add-new-education")
    public ResponseEntity<?> addNewEducation(@RequestParam("userId") long userId,
                                              @RequestBody EducationDTO educationDTO) {
        try {
            userService.addNewEducation(userId, educationDTO);
            return ResponseEntity.status(HttpStatus.OK).body("Education was added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/get-follow-status")
    public ResponseEntity<?> getFollowStatus(@RequestParam("userId") long userId,
                                             @RequestParam("id") long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getFollowStatus(userId, id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/get-user-company")
    public ResponseEntity<?> getUserCompany(@RequestParam("userId") long userId){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUserCompany(userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/follow-user")
    public ResponseEntity<?> followUser(@RequestParam("userId") long userId,
                                        @RequestParam("id") long id) {
        try {
            userService.followUser(userId, id);
            return ResponseEntity.status(HttpStatus.OK).body("User followed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/unfollow-user")
    public ResponseEntity<?> unfollowUser(@RequestParam("userId") long userId,
                                        @RequestParam("id") long id) {
        try {
            userService.unfollowUser(userId, id);
            return ResponseEntity.status(HttpStatus.OK).body("User unfollowed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/is-user-admin")
    public ResponseEntity<?> isUserAdmin(@RequestParam("userId") Long userId,
                                         @RequestParam("id") Long id) throws Exception {
        try {
            return ResponseEntity.ok(userService.isUserAdmin(userId, id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/leave-organization")
    public ResponseEntity<?> leaveOrganization(@RequestParam("userId") long userId) {
        try {
            userService.leaveOrganization(userId);
            return ResponseEntity.status(HttpStatus.OK).body("User has left Organization successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @GetMapping("/is-signed-up")
    public ResponseEntity<?> isSignedUp(@RequestParam("userId") long userId){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.isSignedUp(userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }

    @PutMapping("/update-user-info")
    public ResponseEntity<?> updateUserInfo(@RequestBody List<SkillDTO> skills,
                                            @RequestParam("userId") long userId,
                                            @RequestParam("about") String about,
                                            @RequestParam("title") String title) {
        try {
            userService.updateUserInfo(skills, userId, about, title);
            return ResponseEntity.status(HttpStatus.OK).body("User has updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/search-users")
    public ResponseEntity<?> searchUsers(@RequestParam("keyWord") String keyWord){
        return  ResponseEntity.ok(userService.searchUsers(keyWord));
    }
    @GetMapping("/search-company")
    public ResponseEntity<?> searchCompany(@RequestParam("keyWord") String keyWord){
        return  ResponseEntity.ok(userService.searchCompany(keyWord));
    }
}
