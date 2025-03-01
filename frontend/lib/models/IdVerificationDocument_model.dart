class IdVerificationDocument {
  final String id;
  final String userId;
  final String idType;
  final String file;
  final String selfie;
  final String? status;  // Made nullable
  final String adminRemark;

  IdVerificationDocument({
    required this.id,
    required this.userId,
    required this.idType,
    required this.file,
    required this.selfie,
    this.status,         
    required this.adminRemark,
  });

  factory IdVerificationDocument.fromJson(Map<String, dynamic> json) {
    return IdVerificationDocument(
      id: json['_id'] ?? '',
      userId: json['userId'] ?? '',
      idType: json['idType'] ?? '',
      file: json['idDocument'] ?? '',
      selfie: json['selfie'] ?? '',
      status: json['status'], 
      adminRemark: json['adminRemark'] ?? '',
    );
  }
}