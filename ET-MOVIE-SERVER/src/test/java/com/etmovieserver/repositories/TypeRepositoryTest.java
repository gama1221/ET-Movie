package com.etmovieserver.repositories;

import com.etmovieserver.domain.Type;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Inno Fang on 2018/4/27.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class TypeRepositoryTest {

    @Autowired
    private TypeRepository typeRepository;

    private List<Type> typeList = new ArrayList<>();

    @Before
    public void init(){
        typeList.add(new Type("plot"));
        typeList.add(new Type("comedy"));
        typeList.add(new Type("thriller"));
        typeList.add(new Type("action"));
        typeList.add(new Type("love"));
        typeList.add(new Type("crime"));
        typeList.add(new Type("fear"));
        typeList.add(new Type("adventure"));
        typeList.add(new Type("suspenseful"));
        typeList.add(new Type("science fiction"));
        typeList.add(new Type("family"));
        typeList.add(new Type("fantasy"));
        typeList.add(new Type("animation"));
        typeList.add(new Type("war"));
        typeList.add(new Type("history"));
        typeList.add(new Type("biography"));
        typeList.add(new Type("music"));
        typeList.add(new Type("songanddance"));
        typeList.add(new Type("sports"));
        typeList.add(new Type("west"));
        typeList.add(new Type("documentary"));
    }

    @Test
//    @Ignore
    public void testForAddingType() {
        for (Type type : typeList) {
            typeRepository.save(type);
        }
    }
}