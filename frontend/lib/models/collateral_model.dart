class Collateral {
  final String id;
  final String file;
  final String documentType;
  final String status;

  Collateral({
    required this.id,
    required this.file,
    required this.documentType,
    required this.status,
  });

factory Collateral.fromJson(Map<String, dynamic> json) {
    return Collateral(
      id: json["_id"],
      file: json["file"],

      documentType: json["documentType"],
      status: json["status"],
    );
  }
}