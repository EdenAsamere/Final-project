import 'package:equbapp/models/loginUser_model.dart';

abstract class LoginEvent {}

class LoginUser extends LoginEvent {
  final LoginUserModel user;
  LoginUser(this.user);
}