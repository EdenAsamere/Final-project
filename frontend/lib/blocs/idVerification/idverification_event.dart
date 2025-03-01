import 'package:equbapp/models/IdVerificationDocument_model.dart';

abstract class IdVerificationEvent {}

class UploadIdVerificationDocument extends IdVerificationEvent {
  final IdVerificationDocument idVerificationDocument;
  UploadIdVerificationDocument(this.idVerificationDocument);
}

class UploadSelfie extends IdVerificationEvent {
  final IdVerificationDocument idVerificationDocument;
  UploadSelfie(this.idVerificationDocument);
}

class SubmitIdDocuments extends IdVerificationEvent{}
