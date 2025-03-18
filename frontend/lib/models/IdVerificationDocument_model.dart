class IdVerificationDocument {
  final String id;
  final String userId;
  final String idType;
  final String frontId;
  final String backId;
  final String selfie;
  final String? status;  // Made nullable
  final String adminRemark;

  IdVerificationDocument({
    required this.id,
    required this.userId,
    required this.idType,
    required this.frontId,
    required this.backId,
    required this.selfie,
    this.status,         
    required this.adminRemark,
  });

  factory IdVerificationDocument.fromJson(Map<String, dynamic> json) {
    return IdVerificationDocument(
      id: json['_id'] ?? '',
      userId: json['userId'] ?? '',
      idType: json['idType'] ?? '',
      frontId: json['frontidDocument'] ?? '',
      backId: json['backidDocument'] ?? '',
      selfie: json['selfie'] ?? '',
      status: json['status'], 
      adminRemark: json['adminRemark'] ?? '',
    );
  }
}