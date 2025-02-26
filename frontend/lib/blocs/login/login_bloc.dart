import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equbapp/repositories/user_repository.dart';
import 'package:equbapp/blocs/login/login_state.dart';
import 'package:equbapp/blocs/login/login_event.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final UserRepository userRepository;

  LoginBloc(this.userRepository) : super(LoginInitial()) {
    on<LoginUser>((event, emit) async {
      emit(LoginLoading());
      try {
        bool isLoggedIn = await userRepository.login(event.user);

        if (isLoggedIn) {
          emit(LoginSuccess());
        } else {
          emit(LoginFailure("Invalid phone number or password"));
        }
      } catch (e) {
        emit(LoginFailure("An error occurred. Please try again later."));
      }
    });
  }
}
