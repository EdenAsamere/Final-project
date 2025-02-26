class UserProfile {
  final String firstName;
  final String lastName;
  final String email;
  final String profilePic;
  final String city;
  final int penaltyPoints;

  UserProfile({
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.profilePic,
    required this.city,
    required this.penaltyPoints,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      firstName: json["firstName"] ?? "",
      lastName: json["lastName"] ?? "",
      email: json["email"] ?? "",
      profilePic: json["profilePic"] ?? "",
      city: json["address"]["city"] ?? "",
      penaltyPoints: json["penality"]["penalityPoints"] ?? 0,
    );
  }
}
