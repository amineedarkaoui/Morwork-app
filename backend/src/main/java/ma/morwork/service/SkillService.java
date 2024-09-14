package ma.morwork.service;

import lombok.RequiredArgsConstructor;
import ma.morwork.dto.SkillDTO;
import ma.morwork.modele.Skill;
import ma.morwork.modele.User;
import ma.morwork.repository.SkillRepository;
import ma.morwork.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SkillService {
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public List<SkillDTO> getAllSkills() {
        List<Skill> skills = skillRepository.findAll();
        List<SkillDTO> skillList = new ArrayList<>();

        for (Skill skill : skills) {
            skillList.add(modelMapper.map(skill, SkillDTO.class));
        }

        return skillList;
    }

    public void updateUserSkills(long userId, List<SkillDTO> skills) {
        List<Skill> userSkills = new ArrayList<>();
        for (SkillDTO skill : skills) {
            userSkills.add(modelMapper.map(skill, Skill.class));
        }

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User updatedUser = user.get();
            updatedUser.setSkills(userSkills);
            userRepository.save(updatedUser);
        }
    }
}
