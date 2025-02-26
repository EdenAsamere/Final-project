import 'package:equbapp/blocs/collateral/collateral_event.dart';
import 'package:equbapp/blocs/collateral/collateral_state.dart';
import 'package:equbapp/repositories/user_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CollateralBloc extends Bloc<CollateralEvent, CollateralState> {
  final UserRepository userRepository;

  CollateralBloc(this.userRepository) : super(CollateralInitial()) {
    // Handle UploadCollateral event.
    on<UploadCollateral>((event, emit) async {
      emit(CollateralLoading());
      try {
        final uploadedCollateral = await userRepository.uploadCollateralDocument(event.collateral);
        if (uploadedCollateral != null) {
          emit(CollateralSuccess(uploadedCollateral));
        } else {
          emit(CollateralFailure("Failed to add collateral"));
        }
      } catch (e) {
        emit(CollateralFailure("An error occurred. Please try again later."));
      }
    });

    // Handle FetchCollateral event.
    on<FetchCollateral>((event, emit) async {
      emit(CollateralLoading());
      try {
        final collateral = await userRepository.fetchUploadedCollateral(event.id);
        if (collateral != null) {
          emit(CollateralSuccess(collateral));
        } else {
          emit(CollateralFailure("Collateral not found"));
        }
      } catch (e) {
        emit(CollateralFailure("An error occurred. Please try again later."));
      }
    });

    // Handle FetchAllCollaterals event.
    on<FetchAllCollaterals>((event, emit) async {
      emit(CollateralLoading());
      try {
        final collaterals = await userRepository.fetchAllUploadedCollaterals();
        if (collaterals.isNotEmpty) {
          emit(CollateralListSuccess(collaterals));
        } else {
          emit(CollateralFailure("No collateral found"));
        }
      } catch (e) {
        emit(CollateralFailure("An error occurred. Please try again later."));
      }
    });

    // Handle UpdateCollateral event.
    on<UpdateCollateral>((event, emit) async {
      emit(CollateralLoading());
      try {
        final updatedCollateral = await userRepository.updateCollateralDocument(event.collateral, event.collateral.id);
        if (updatedCollateral != null) {
          emit(CollateralSuccess(updatedCollateral));
        } else {
          emit(CollateralFailure("Failed to update collateral"));
        }
      } catch (e) {
        emit(CollateralFailure("An error occurred. Please try again later."));
      }
    });
  }
}
