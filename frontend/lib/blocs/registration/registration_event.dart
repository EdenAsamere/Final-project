import '../../models/user_model.dart';

abstract class RegistrationEvent {}

class RegisterUser extends RegistrationEvent {
  final User user;
  RegisterUser(this.user);
}
