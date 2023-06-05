package com.etmovieserver.exception;

import com.etmovieserver.enums.ResultEnum;

/**
 * Created by Inno Fang on 2018/4/28.
 */
public class MovieNotFoundException extends BaseException {
    public MovieNotFoundException(ResultEnum resultEnum) {
        super(resultEnum);
    }
}
