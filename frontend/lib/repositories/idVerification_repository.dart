import 'dart:convert';
import 'dart:io';
import 'package:equbapp/models/IdVerificationDocument_model.dart';
import 'package:http/http.dart' as http;
import 'package:equbapp/utils/auth_storage.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import '../repositories/baseurl.dart';


class IdverificationRepository {

  Future<IdVerificationDocument?> uploadIdVerificationDocument(
    IdVerificationDocument idVerificationDocument) async {
  try {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/idVerification/uploadDocument'),
    );
    
    String? token = await AuthStorage.getToken();
    if (token == null) {
      print("Error: Token is null");
      return null;
    }
    request.headers['Authorization'] = 'Bearer $token';

    // FRONT ID FILE
    File frontFile = File(idVerificationDocument.frontId);
    if (!frontFile.existsSync()) {
      print("Error: Front ID file does not exist at ${idVerificationDocument.frontId}");
      return null;
    }
    final frontMimeType = lookupMimeType(idVerificationDocument.frontId) ?? "application/octet-stream";
    final frontMimeTypeData = frontMimeType.split('/');
    var frontMultipartFile = await http.MultipartFile.fromPath(
      'frontId', // 👈 Updated field name
      idVerificationDocument.frontId,
      contentType: MediaType(frontMimeTypeData[0], frontMimeTypeData[1]),
    );
    request.files.add(frontMultipartFile);

    // BACK ID FILE
    File backFile = File(idVerificationDocument.backId);
    if (!backFile.existsSync()) {
      print("Error: Back ID file does not exist at ${idVerificationDocument.backId}");
      return null;
    }
    final backMimeType = lookupMimeType(idVerificationDocument.backId) ?? "application/octet-stream";
    final backMimeTypeData = backMimeType.split('/');
    var backMultipartFile = await http.MultipartFile.fromPath(
      'backId', // 👈 Updated field name
      idVerificationDocument.backId,
      contentType: MediaType(backMimeTypeData[0], backMimeTypeData[1]),
    );
    request.files.add(backMultipartFile);

    request.fields['idType'] = idVerificationDocument.idType;

    var streamResponse = await request.send();
    var response = await http.Response.fromStream(streamResponse);
    print(jsonEncode(response.body));

    if (response.statusCode == 201) {
      final responseData = json.decode(response.body);
      print(responseData);
      return IdVerificationDocument.fromJson(responseData["data"]);
    } else {
      print("Failed to upload document: ${response.statusCode} - ${response.body}");
      return null;
    }
  } catch (e) {
    print("Error during document upload: $e");
    return null;
  }
}

  Future<IdVerificationDocument?> uploadSelfie(IdVerificationDocument idVerificationDocument) async {

    try{
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/idVerification/uploadSelfie'),
      );
      String? token = await AuthStorage.getToken();
      if (token == null) {
        print("Error: Token is null");
        return null;
      }
      request.headers['Authorization'] = 'Bearer $token';
      File file = File(idVerificationDocument.selfie);
      if (!file.existsSync()) {
        print("Error: File does not exist at path ${idVerificationDocument.selfie}");
        return null;
      }

      final mimeType = lookupMimeType(idVerificationDocument.selfie) ?? "application/octet-stream";
      final mimeTypeData = mimeType.split('/');

      var multipartFile = await http.MultipartFile.fromPath(
        'file',
        idVerificationDocument.selfie,
        contentType: MediaType(mimeTypeData[0], mimeTypeData[1]),
      );
      request.files.add(multipartFile);
      var streamResponse = await request.send();
      var response = await http.Response.fromStream(streamResponse);
      print(jsonEncode(response.body));

      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        print(responseData);
        return IdVerificationDocument.fromJson(responseData["data"]);
      } else {
        print("Failed to upload selfie: ${response.statusCode} - ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error during selfie upload: $e");
      return null;
    }
  }

  Future<IdVerificationDocument?> submitIdVerificationDocuments() async{
    try{
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/idVerification/submit'),
      );
      String? token = await AuthStorage.getToken();
      if (token == null) {
        print("Error: Token is null");
        return null;
      }
      request.headers['Authorization'] = 'Bearer $token';
      var streamResponse = await request.send();
      var response = await http.Response.fromStream(streamResponse);
      print(jsonEncode(response.body));

      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        print(responseData);
        return IdVerificationDocument.fromJson(responseData["data"]);
      } else {
        print("Failed to submit documents: ${response.statusCode} - ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error during document submission: $e");
      return null;
  }
  }
 

}