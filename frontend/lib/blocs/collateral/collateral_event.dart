import 'package:equbapp/models/collateral_model.dart';

abstract class CollateralEvent {}

class UploadCollateral extends CollateralEvent {
  final Collateral collateral;
  UploadCollateral(this.collateral);

}

class FetchCollateral extends CollateralEvent {
  final String id;
  FetchCollateral(this.id);
}

class FetchAllCollaterals extends CollateralEvent {}

class UpdateCollateral extends CollateralEvent {
  final Collateral collateral;
  UpdateCollateral(this.collateral);
}

class DeleteCollateral extends CollateralEvent {
  final String id;
  DeleteCollateral(this.id);
}