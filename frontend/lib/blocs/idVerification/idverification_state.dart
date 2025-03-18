abstract class IdVerificationState {}

class IdVerificationInitial extends IdVerificationState {}

class IdVerificationLoading extends IdVerificationState {}

class IdVerificationSuccess extends IdVerificationState {
  final String message;
  IdVerificationSuccess(this.message);
}
class IdVerificationFailure extends IdVerificationState {
  final String error;
  IdVerificationFailure(this.error);
}

class IdSubmittedSuccess extends IdVerificationState {
  final String message;
  IdSubmittedSuccess(this.message);
}

class IdSubmittedFailure extends IdVerificationState {
  final String error;
  IdSubmittedFailure(this.error);
}
