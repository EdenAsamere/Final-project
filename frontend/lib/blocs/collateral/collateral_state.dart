import 'package:equbapp/models/collateral_model.dart';

abstract class CollateralState {}

class CollateralInitial extends CollateralState {}

class CollateralLoading extends CollateralState {}

class CollateralSuccess extends CollateralState {
  final Collateral collateral;
  CollateralSuccess(this.collateral);
}

class CollateralListSuccess extends CollateralState {
  final List<Collateral> collaterals;
  CollateralListSuccess(this.collaterals);
}

class CollateralFailure extends CollateralState {
  final String error;
  CollateralFailure(this.error);
}
