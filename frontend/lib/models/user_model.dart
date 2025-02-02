class User{
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final String city;
  final String password;
  final String confirmPassword;

  User({
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    required this.city,
    required this.password,
    required this.confirmPassword,
  });

  Map<String, dynamic> toJson() {
    return {
      "firstName": firstName,
      "lastName": lastName,
      "phoneNumber": phoneNumber,
      "city": city,
      "password": password,
      "confirmPassword": confirmPassword,
    };
  }
}
