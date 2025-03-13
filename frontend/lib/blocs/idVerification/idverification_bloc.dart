

import 'package:equbapp/blocs/idVerification/idverification_event.dart';
import 'package:equbapp/blocs/idVerification/idverification_state.dart';
import 'package:equbapp/repositories/idVerification_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class IdverificationBloc extends Bloc<IdVerificationEvent, IdVerificationState> {
  final IdverificationRepository idverificationRepository;

    IdverificationBloc(this.idverificationRepository) : super(IdVerificationInitial()) {

      on<UploadIdVerificationDocument>((event, emit) async {
        emit(IdVerificationLoading());
        try {
          final uploadedIdVerificationDocument = await idverificationRepository.uploadIdVerificationDocument(event.idVerificationDocument);
          if (uploadedIdVerificationDocument != null) {
            emit(IdVerificationSuccess("Id Verification Document uploaded successfully"));
          } else {
            emit(IdVerificationFailure("Failed to upload Id Verification Document"));
          }
        } catch (e) {
          emit(IdVerificationFailure("An error occurred. Please try again later."));
        }
      });

      on<UploadSelfie>((event, emit) async {
        emit(IdVerificationLoading());
        try {
          final uploadedSelfie = await idverificationRepository.uploadSelfie(event.idVerificationDocument);
          if (uploadedSelfie != null) {
            emit(IdVerificationSuccess("Selfie uploaded successfully"));
          } else {
            emit(IdVerificationFailure("Failed to upload selfie"));
          }
        } catch (e) {
          emit(IdVerificationFailure("An error occurred. Please try again later."));
        }
      });


      on<SubmitIdDocuments>((event, emit) async {
        emit(IdVerificationLoading());
        try {
          final submittedIdDocuments = await idverificationRepository.submitIdVerificationDocuments();
          if (submittedIdDocuments != null) {
            emit(IdVerificationSuccess("Id Documents submitted successfully"));
          } else {
            emit(IdVerificationFailure("Failed to submit Id Documents"));
          }
        } catch (e) {
          emit(IdVerificationFailure("An error occurred. Please try again later."));
        }
      });

}
}