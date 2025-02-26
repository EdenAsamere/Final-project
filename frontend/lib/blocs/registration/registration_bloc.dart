import 'package:flutter_bloc/flutter_bloc.dart';
import '../../repositories/user_repository.dart';
import 'registration_event.dart';
import 'registration_state.dart';

class RegistrationBloc extends Bloc<RegistrationEvent, RegistrationState> {
  final UserRepository userRepository;

  RegistrationBloc(this.userRepository) : super(RegistrationInitial()) {
    on<RegisterUser>((event, emit) async {
      emit(RegistrationLoading());
      try {
        await userRepository.registerUser(event.user);
        emit(RegistrationSuccess());
      } catch (e) {
        String errorMessage = "Registration failed. Please try again.";
        if (e.toString().contains('E11000 duplicate key error')) {
          errorMessage = "This phone number is already registered. Please use a different number.";
        }
        emit(RegistrationFailure(errorMessage));
      }
    });
  }
}
