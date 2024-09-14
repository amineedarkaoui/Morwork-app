package ma.morwork.service;


import lombok.AllArgsConstructor;
import ma.morwork.dto.ApplyDTO;
import ma.morwork.dto.JobTypeDTO;
import ma.morwork.modele.Apply;
import ma.morwork.modele.JobPost;
import ma.morwork.modele.JobType;
import ma.morwork.modele.User;
import ma.morwork.repository.ApplyRepository;
import ma.morwork.repository.JobPostRepository;
import ma.morwork.repository.JobTypeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class JobTypeService {
    private final JobTypeRepository jobTypeRepository;
    private final ModelMapper modelMapper;
    @Autowired
    private final UserService userService;
    @Autowired
    private final JobPostRepository jobPostRepository;
    @Autowired
    private final ApplyRepository applyRepository;
    public List<JobTypeDTO> getAllJobTypes() {
        List<JobType> jobTypes = jobTypeRepository.findAll();
        List<JobTypeDTO> jobTypeList = new ArrayList<>();

        for (JobType jobType : jobTypes) {
            jobTypeList.add(modelMapper.map(jobType, JobTypeDTO.class));
        }

        return jobTypeList;
    }

    public void addApply(String description, Long userId, Long jobId){
        User user =  userService.getUserById(userId);
        JobPost jobPost = new JobPost();
        Apply apply = new Apply();
        apply.setDate(LocalDateTime.now());
        apply.setJobPost(jobPostRepository.findById(jobId).orElseThrow());
        apply.setUser(user);
        apply.setDescription(description);
        applyRepository.save(apply);
    }

    public List<ApplyDTO> getAllApplies(){
        List<Apply> applies =  applyRepository.findAll();
        List<ApplyDTO> applyDTOList = new ArrayList<>();

        for(Apply apply : applies){
            ApplyDTO applyDTO = new ApplyDTO();
            applyDTO.setId(apply.getId());
            applyDTO.setDate(apply.getDate());
            applyDTO.setUser(apply.getUser());
            applyDTO.setJobPost(apply.getJobPost());
            applyDTO.setDescription(apply.getDescription());
            applyDTOList.add(applyDTO);
        }
        return applyDTOList;
    }

    public List<ApplyDTO> getAppliesByJobId(Long id){
        List<Apply> applies = applyRepository.findByJobPostId(id);
        List<ApplyDTO> applyDTOList = new ArrayList<>();

        for(Apply apply : applies){
            ApplyDTO applyDTO = new ApplyDTO();
            applyDTO.setId(apply.getId());
            applyDTO.setDate(apply.getDate());
            applyDTO.setUser(apply.getUser());
            applyDTO.setJobPost(apply.getJobPost());
            applyDTO.setDescription(apply.getDescription());
            applyDTOList.add(applyDTO);
        }
        return applyDTOList;
    }
}
