package ma.morwork.service;


import lombok.AllArgsConstructor;
import ma.morwork.dto.ExperienceDTO;
import ma.morwork.modele.Experience;
import ma.morwork.repository.ExperienceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ExperienceService {
    private final ExperienceRepository experienceRepository;
    private final ModelMapper modelMapper;

    public void deleteExperience(long id) throws Exception {
        Optional<Experience> experience = experienceRepository.findById(id);
        experience.ifPresent(experienceRepository::delete);
    }

    public void updateExperience(ExperienceDTO experienceDTO) throws Exception {
        if (experienceDTO.getCompany() == null) {
            experienceDTO.setImage("experience.jpg");
        }
        Experience experience = modelMapper.map(experienceDTO, Experience.class);
        Experience oldExp = experienceRepository.findById(experienceDTO.getId()).orElseThrow();
        oldExp.setTitle(experience.getTitle());
        oldExp.setDescription(experience.getDescription());
        oldExp.setCompany(experience.getCompany());
        oldExp.setCompanyLabel(experience.getCompanyLabel());
        oldExp.setCity(experience.getCity());
        oldExp.setJobType(experience.getJobType());
        oldExp.setStartDate(experience.getStartDate());
        oldExp.setEndDate(experience.getEndDate());
        oldExp.setImage(experience.getImage());
        experienceRepository.save(oldExp);
    }
}
