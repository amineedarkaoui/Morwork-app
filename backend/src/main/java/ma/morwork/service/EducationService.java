package ma.morwork.service;


import lombok.AllArgsConstructor;
import ma.morwork.dto.EducationDTO;
import ma.morwork.dto.ExperienceDTO;
import ma.morwork.modele.Education;
import ma.morwork.modele.Experience;
import ma.morwork.repository.EducationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class EducationService {
    private final EducationRepository educationRepository;
    private final ModelMapper modelMapper;

    public void deleteEducation(long id) throws Exception {
        Optional<Education> education = educationRepository.findById(id);
        education.ifPresent(educationRepository::delete);
    }

    public void updateEducation(EducationDTO educationDTO) throws Exception {
        if (educationDTO.getCompany() == null) {
            educationDTO.setImage("experience.jpg");
        }
        Education experience = modelMapper.map(educationDTO, Education.class);
        Education oldEdu = educationRepository.findById(educationDTO.getId()).orElseThrow();
        oldEdu.setDegree(experience.getDegree());
        oldEdu.setFieldOfStudy(experience.getFieldOfStudy());
        oldEdu.setDescription(experience.getDescription());
        oldEdu.setCompany(experience.getCompany());
        oldEdu.setSchool(experience.getSchool());
        oldEdu.setCity(experience.getCity());
        oldEdu.setStartDate(experience.getStartDate());
        oldEdu.setEndDate(experience.getEndDate());
        oldEdu.setImage(experience.getImage());
        educationRepository.save(oldEdu);
    }
}
