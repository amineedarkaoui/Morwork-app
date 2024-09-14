package ma.morwork.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import ma.morwork.config.ServerMedia;
import ma.morwork.dto.CompanyDTO;
import ma.morwork.modele.City;
import ma.morwork.modele.Company;
import ma.morwork.modele.Industry;
import ma.morwork.modele.User;
import ma.morwork.repository.CityRepository;
import ma.morwork.repository.CompanyRepository;
import ma.morwork.repository.IndustryRepository;
import ma.morwork.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {
    public final CompanyRepository companyRepository;
    public final ModelMapper modelMapper;
    public final ServerMedia serverMedia;
    public final UserRepository userRepository;
    public final IndustryRepository industryRepository;
    public final CityRepository cityRepository;

    ObjectMapper objectMapper = new ObjectMapper();
    @Value("${media.directory}")
    private String MyDirectory;

    public List<CompanyDTO> getAllCompanies() {
            List<Company> companies = companyRepository.findByType("company");
        List<CompanyDTO> companyList = new ArrayList<>();

        for (Company company : companies) {
            company.setImage(serverMedia.serveMedia(company.getImage()));
            companyList.add(modelMapper.map(company, CompanyDTO.class));
        }

        return companyList;
    }

    public List<CompanyDTO> getAllSchools() {
        List<Company> companies = companyRepository.findByType("school");
        List<CompanyDTO> companyList = new ArrayList<>();

        for (Company company : companies) {
            company.setImage(serverMedia.serveMedia(company.getImage()));
            companyList.add(modelMapper.map(company, CompanyDTO.class));
        }

        return companyList;
    }

    public String getDefaultLogo(String type) {
        if (type.equals("school")) {
            return serverMedia.serveMedia("education.jpg");
        } else {
            return serverMedia.serveMedia("experience.jpg");
        }
    }

    public Long addNewOrganization(Long userId, CompanyDTO companyDTO) throws Exception {
        Company company = modelMapper.map(companyDTO, Company.class);

        Company savedCompany = companyRepository.save(company);
        User user = userRepository.findById(userId).get();
        user.setCompany(savedCompany);
        userRepository.save(user);
        return savedCompany.getId();
    }

    public void updateCompanyImage(Long id, MultipartFile image) throws Exception {
        Company company = companyRepository.findById(id).get();

        if (image != null) {
            String originalFileName = image.getOriginalFilename();
            String fileName = serverMedia.addRandomSequence(originalFileName);
            String filePath = String.valueOf(Paths.get(MyDirectory, fileName));
            Files.write(Path.of(filePath), image.getBytes());

            company.setImage(fileName);
        } else {
            if (company.getType().equals("company"))
                company.setImage("experience.jpg");
            else
                company.setImage("education.jpg");
        }

        companyRepository.save(company);
    }

    public void updateCompanyCover(Long id, MultipartFile cover) throws Exception {
        Company company = companyRepository.findById(id).get();

        if (cover != null) {
            String originalFileName = cover.getOriginalFilename();
            String fileName = serverMedia.addRandomSequence(originalFileName);
            String filePath = String.valueOf(Paths.get(MyDirectory, fileName));
            Files.write(Path.of(filePath), cover.getBytes());

            company.setCover(fileName);
        } else {
            company.setCover("cover.jpg");
        }

        companyRepository.save(company);
    }

    public void deleteImage(long id) throws Exception {
        Company company = companyRepository.findById(id).get();
        if (company.getType().equals("school")) {
            company.setImage("education.jpg");
        } else {
            company.setImage("experience.jpg");
        }
        companyRepository.save(company);
    }

    public void deleteCover(long id) throws Exception {
        Company company = companyRepository.findById(id).get();
        company.setCover("cover.jpg");
        companyRepository.save(company);
    }

    public void updateDescription(long id, String description) throws Exception {
        Company company = companyRepository.findById(id).get();
        company.setDescription(description);
        companyRepository.save(company);
    }

    public void updateInfo(CompanyDTO companyDTO) throws Exception {
        Company company = companyRepository.findById(companyDTO.getId()).get();

        company.setName(companyDTO.getName());
        company.setTagline(companyDTO.getTagline());
        company.setIndustry(modelMapper.map(companyDTO.getIndustry(), Industry.class));
        company.setType(companyDTO.getType());
        company.setDescription(companyDTO.getDescription());
        company.setHeadquarters(modelMapper.map(companyDTO.getHeadquarters(), City.class));
        company.setCreationDate(companyDTO.getCreationDate());
        company.setEmployesNum(companyDTO.getEmployesNum());

        companyRepository.save(company);
    }

    public CompanyDTO getCompany(long id) throws Exception {
        CompanyDTO company = modelMapper.map(companyRepository.findById(id).get(), CompanyDTO.class);
        company.setImage(serverMedia.serveMedia(company.getImage()));
        company.setCover(serverMedia.serveMedia(company.getCover()));

        return company;
    }
}
