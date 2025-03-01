import 'package:equbapp/models/user_profile.dart';
abstract class ProfileEvent {}

class LoadProfile extends ProfileEvent {
  LoadProfile();
}

class GetIdDocumentVerificationStatus extends ProfileEvent {
  GetIdDocumentVerificationStatus();
}




