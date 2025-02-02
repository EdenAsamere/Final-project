import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equbapp/repositories/user_repository.dart';
import 'package:equbapp/models/loginUser_model.dart';
import 'package:equbapp/blocs/login_state.dart';
import 'package:equbapp/blocs/login_event.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final UserRepository userRepository;

  LoginBloc(this.userRepository) : super(LoginInitial()) {
    on<LoginUser>((event, emit) async {
      emit(LoginLoading());
      try {
        await userRepository.login(event.user);
        emit(LoginSuccess());
      } catch (e) {
        String errorMessage = "Invalid phone number or password";

        emit(LoginFailure(errorMessage));
      }
    });
  }
}
