package com.hrmanagement.payload.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Họ không được để trống")
    private String ho;

    @NotBlank(message = "Tên không được để trống")
    private String ten;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String matKhau;

    @Min(value = 1, message = "Tuổi phải là số dương")
    @Max(value = 120, message =  "Tuổi không hợp lệ !")
    private int tuoi;

    @NotBlank
    private String gioiTinh;
}
