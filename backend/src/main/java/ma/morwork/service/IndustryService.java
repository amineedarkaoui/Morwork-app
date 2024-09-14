package ma.morwork.service;

import lombok.RequiredArgsConstructor;
import ma.morwork.dto.IndustryDTO;
import ma.morwork.modele.Industry;
import ma.morwork.repository.IndustryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IndustryService {
    private final IndustryRepository industryRepository;
    private final ModelMapper modelMapper;

    public List<IndustryDTO> getAllIndustries() {
        List< Industry> industries = industryRepository.findAll();
        return industries.stream()
                .map(industry -> modelMapper.map(industry, IndustryDTO.class))
                .toList();
    }
}
