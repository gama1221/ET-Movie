package com.etmovieserver.handle;

import com.etmovieserver.domain.Result;
import com.etmovieserver.enums.ResultEnum;
import com.etmovieserver.exception.BaseException;
import com.etmovieserver.utils.ResultUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Inno Fang on 2018/4/28.
 */
@ControllerAdvice
public class ExceptionHandle {

    public static final Logger logger = LoggerFactory.getLogger(ExceptionHandle.class);

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public Result handle(Exception e) {
        if (e instanceof BaseException) {
            BaseException exception = (BaseException) e;
            return ResultUtil.error(exception.getStatus(), exception.getMessage());
        }
        logger.error(e.getMessage());
        return ResultUtil.error(ResultEnum.UNKNOWN_ERROR);
    }
}
