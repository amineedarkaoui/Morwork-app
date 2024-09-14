package ma.morwork.service;


import lombok.AllArgsConstructor;
import ma.morwork.dto.CityDTO;
import ma.morwork.dto.CityDTO;
import ma.morwork.modele.City;
import ma.morwork.modele.City;
import ma.morwork.repository.CityRepository;
import ma.morwork.repository.CityRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CityService {
    public final CityRepository cityRepository;
    public final ModelMapper modelMapper;

    public List<CityDTO> getAllCities() {
        List<City> cities = cityRepository.findAll();
        List<CityDTO> cityList = new ArrayList<>();

        for (City city : cities) {
            cityList.add(modelMapper.map(city, CityDTO.class));
        }

        return cityList;
    }
}
