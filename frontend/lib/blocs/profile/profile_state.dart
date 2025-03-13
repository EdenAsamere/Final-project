import 'package:equbapp/models/user_profile.dart';

abstract class ProfileState {}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class UserStatusLoading extends ProfileState {}

class ProfileSuccess extends ProfileState {
  final UserProfile profile;

  ProfileSuccess(this.profile);
}

class UserStatusSuccess extends ProfileState {
  final String? status;

  UserStatusSuccess(this.status);
}
class UserStatusFailure extends ProfileState {
  final String error;

  UserStatusFailure(this.error);
}

class ProfileFailure extends ProfileState {
  final String error;


  ProfileFailure(this.error);
}
