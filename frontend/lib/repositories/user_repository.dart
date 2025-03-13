import 'dart:convert';
import 'dart:io';
import 'package:equbapp/models/collateral_model.dart';
import 'package:equbapp/models/user_profile.dart';
import 'package:equbapp/repositories/baseurl.dart';
import 'package:http/http.dart' as http;
import 'package:equbapp/models/loginUser_model.dart';
import 'package:equbapp/models/user_model.dart';
import 'package:equbapp/utils/auth_storage.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';

class UserRepository {
  Future<void> registerUser(User user) async {
    final response = await http.post(
      Uri.parse("$baseUrl/users/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(user.toJson()),
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['message'] ?? 'Registration failed');
    }
  }


  /// Login user and store token
  Future<bool> login(LoginUserModel loggedInUser) async {
  try {
    final response = await http.post(
      Uri.parse("$baseUrl/users/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(loggedInUser.toJson()),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      if (data["user"] != null && data["user"]["token"] != null) {
        String token = data["user"]["token"];
        
        // Store the token securely
        await AuthStorage.saveToken(token);
        return true; // Login successful
      } else {
        return false; // Invalid response format
      }
    } else {
      print("Login failed: ${response.body}"); // Log the failure reason
      return false; // Invalid credentials
    }
  } catch (e) {
    print("Error during login: $e");
    return false; // Handle network error
  }
}

  /// Logout user (clear token)
  Future<void> logout() async {
    await AuthStorage.clearToken();
  }

  /// Get user profile
  Future<UserProfile?> fetchUserProfile() async {
    try {
      String? token = await AuthStorage.getToken();
      if (token == null) return null;

      final response = await http.get(
        Uri.parse("$baseUrl/profile"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)["data"];
        print(data);
        return UserProfile.fromJson(data);
      } else {
        print("Failed to fetch profile: ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error fetching profile: $e");
      return null;
    }
  }

/// upload collateral
Future<Collateral?> uploadCollateralDocument(Collateral collateral) async {
    try {
      // Create a multipart request targeting the collateral upload endpoint
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/profile/collateral/upload'),
      );

      // Get the auth token and add it to the headers
      String? token = await AuthStorage.getToken();
      if (token == null) {
        print("Error: Token is null");
        return null;
      }
      request.headers['Authorization'] = 'Bearer $token';

      // Verify the file exists
      File file = File(collateral.file);
      if (!file.existsSync()) {
        print("Error: File does not exist at path ${collateral.file}");
        return null;
      }

      final mimeType = lookupMimeType(collateral.file) ?? "application/octet-stream";
      final mimeTypeData = mimeType.split('/');

      var multipartFile = await http.MultipartFile.fromPath(
        'file',
        collateral.file,
        contentType: MediaType(mimeTypeData[0], mimeTypeData[1]),
      );
      request.files.add(multipartFile);
      request.fields['documentType'] = collateral.documentType;

      var streamResponse = await request.send();
      var response = await http.Response.fromStream(streamResponse);
      print(jsonEncode(response.body));

      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        print(responseData);
        return Collateral.fromJson(responseData["data"]);
      } else {
        print("Failed to upload collateral: ${response.statusCode} - ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error during collateral upload: $e");
      return null;
    }
  }

Future<Collateral?> fetchUploadedCollateral(String id) async {

  try {
    String? token = await AuthStorage.getToken();
    if (token == null) return null;
    final response = await http.get(
      Uri.parse("$baseUrl/profile/collateral/$id"), 
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    if (response.statusCode == 201) {
        final data = jsonDecode(response.body)["data"];
        print(data);
        return Collateral.fromJson(data);
      } else {
        print("Failed to fetch profile: ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error fetching profile: $e");
      return null;
    }

   
}
Future<List<Collateral>> fetchAllUploadedCollaterals() async {
  try {
    String? token = await AuthStorage.getToken();
    if (token == null) return [];
    final response = await http.get(
      Uri.parse("$baseUrl/profile/my-collaterals"), 
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body)["data"] as List;
      return data.map((e) => Collateral.fromJson(e)).toList();
    } else {
      print("Failed to fetch collaterals: ${response.body}");
      return [];
    }
  } catch (e) {
    print("Error fetching collaterals: $e");
    return [];
  }
}

Future<Collateral?> updateCollateralDocument(Collateral collateral,String id) async {
    try {
      // Create a multipart request targeting the collateral upload endpoint
      var request = http.MultipartRequest(
        'PUT',
        Uri.parse('$baseUrl/profile/collateral/update-document/$id'),
      );

      // Get the auth token and add it to the headers
      String? token = await AuthStorage.getToken();
      if (token == null) {
        print("Error: Token is null");
        return null;
      }
      request.headers['Authorization'] = 'Bearer $token';

      // Verify the file exists
      File file = File(collateral.file);
      if (!file.existsSync()) {
        print("Error: File does not exist at path ${collateral.file}");
        return null;
      }

      request.fields['documentType'] = collateral.documentType;
      final mimeType = lookupMimeType(collateral.file) ?? "application/octet-stream";
      final mimeTypeData = mimeType.split('/');

      var multipartFile = await http.MultipartFile.fromPath(
        'file',
        collateral.file,
        contentType: MediaType(mimeTypeData[0], mimeTypeData[1]),
      );
      request.files.add(multipartFile);

      var streamResponse = await request.send();
      var response = await http.Response.fromStream(streamResponse);

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        return Collateral.fromJson(responseData["data"]);
      } else {
        print("Failed to update collateral: ${response.statusCode} - ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error during collateral upload: $e");
      return null;
    }
  }

   Future<bool> removeCollateralDocument(String id) async {
    try {
      String? token = await AuthStorage.getToken();
      if (token == null) return false;

      final response = await http.delete(
        Uri.parse("$baseUrl/profile/delete-collateral/$id"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print("Failed to delete collateral: ${response.body}");
        return false;
      }
    } catch (e) {
      print("Error deleting collateral: $e");
      return false;
    }
  }

  Future<String?> getIdDocumentVerificationStatus() async {
    try {
      String? token = await AuthStorage.getToken();
      if (token == null) return "Not Verified";

      final response = await http.get(
        Uri.parse("$baseUrl/profile/id-documentstatus"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );
      print(response.body);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)["data"];
        if(data != null){
          return data["status"];
        }
        
      } else {
        print("Failed to fetch verification status: ${response.body}");
        return "";
      }
    } catch (e) {
      print("Error fetching verification status: $e");
      return "";
    }
    return null;
  }
}