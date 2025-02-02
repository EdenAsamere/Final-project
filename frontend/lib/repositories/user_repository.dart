import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:equbapp/models/loginUser_model.dart';
import 'package:equbapp/models/user_model.dart';

class UserRepository {
  final String baseUrl = "http://localhost:5000/api/users";

  Future<void> registerUser(User user) async {
    final response = await http.post(
      Uri.parse("$baseUrl/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(user.toJson()),
    );
    if (response.statusCode == 201) {
      print("User registered successfully");
    } else {
      throw Exception("Failed to register user: ${response.body}");
    }
  }

  Future<void> login(LoginUserModel loggedinuser) async {
    final response = await http.post(
      Uri.parse("$baseUrl/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(loggedinuser.toJson()),
    );
    if (response.statusCode == 200) {
      print("User logged in successfully");
    } else {
      throw Exception("Failed to login user: ${response.body}");
    }
  }
}