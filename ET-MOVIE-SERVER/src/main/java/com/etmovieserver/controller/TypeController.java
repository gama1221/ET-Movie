package com.etmovieserver.controller;

import com.etmovieserver.domain.Movie;
import com.etmovieserver.domain.Result;
import com.etmovieserver.domain.Type;
import com.etmovieserver.enums.ResultEnum;
import com.etmovieserver.repositories.TypeRepository;

import com.etmovieserver.utils.ResultUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Inno Fang on 2018/5/9.
 */
@RestController
public class TypeController {

    @Autowired
    private TypeRepository typeRepository;

    @GetMapping(value = "/{type}/{page}")
    public Result<List<Movie>> getMovieListByType(@PathVariable("type") String type,
                                                @PathVariable("page") int page) {
        List<Movie> movies = typeRepository.findMovies(type, PageRequest.of(page, 12));
        return ResultUtil.success(ResultEnum.GET_MOVIE_TYPE_LIST, movies);
    }

    @GetMapping(value = "/count/{type}")
    public Result<Long> getTypeCount(@PathVariable("type") String type) {
        return ResultUtil.success(ResultEnum.GET_MOVIE_COUNT, typeRepository.countByName(type));
    }

    @GetMapping(value = "/types")
    public Result<List<Type>> getAllTypes() {
        return ResultUtil.success(ResultEnum.GET_TYPES, typeRepository.findAll());
    }
}
