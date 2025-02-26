import 'package:equbapp/models/user_profile.dart';

abstract class ProfileState {}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileSuccess extends ProfileState {
  final UserProfile profile;

  ProfileSuccess(this.profile);
}

class ProfileFailure extends ProfileState {
  final String error;

  ProfileFailure(this.error);
}
