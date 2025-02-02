class LoginUserModel {
  final String phoneNumber;
  final String password;

  LoginUserModel({
    required this.phoneNumber,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      "phoneNumber": phoneNumber,
      "password": password,
    };
  }
}