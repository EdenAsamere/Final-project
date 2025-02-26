import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equbapp/repositories/user_repository.dart';
import 'package:equbapp/blocs/profile/profile_event.dart';
import 'package:equbapp/blocs/profile/profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final UserRepository userRepository;

  ProfileBloc(this.userRepository) : super(ProfileInitial()) {
    on<LoadProfile>((event, emit) async {
      emit(ProfileLoading());
      try {
        final profile = await userRepository.fetchUserProfile();
        if (profile != null) {
          emit(ProfileSuccess(profile));
        } else {
          emit(ProfileFailure("Profile data is missing"));
        }
      } catch (e) {
        emit(ProfileFailure("Failed to load profile"));
      }
    });
  }
}
