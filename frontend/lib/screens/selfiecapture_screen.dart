import 'dart:io';
import 'package:camera/camera.dart';
import 'package:equbapp/blocs/idVerification/idverification_bloc.dart';
import 'package:equbapp/blocs/idVerification/idverification_event.dart';
import 'package:equbapp/models/IdVerificationDocument_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SelfieCaptureScreen extends StatefulWidget {
  final String selectedMethod;
  const SelfieCaptureScreen({Key? key, required this.selectedMethod})
      : super(key: key);

  @override
  _SelfieCaptureScreenState createState() => _SelfieCaptureScreenState();
}

class _SelfieCaptureScreenState extends State<SelfieCaptureScreen> {
  CameraController? _cameraController;
  bool _isInitialized = false;
  XFile? _capturedFile;
  late List<CameraDescription> _availableCameras;
  bool _isSelfieUploaded = false; // Track upload status

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    _availableCameras = await availableCameras();
    final frontCamera = _availableCameras.firstWhere(
      (cam) => cam.lensDirection == CameraLensDirection.front,
    );
    _cameraController = CameraController(
      frontCamera,
      ResolutionPreset.medium,
      enableAudio: false,
    );
    await _cameraController!.initialize();
    if (!mounted) return;
    setState(() => _isInitialized = true);
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  Future<void> _captureSelfie() async {
    if (!_cameraController!.value.isInitialized) return;
    final file = await _cameraController!.takePicture();
    setState(() {
      _capturedFile = file;
    });
  }

  void _uploadSelfie() {
    if (_capturedFile != null) {
      final selfieDoc = IdVerificationDocument(
        id: '',
        userId: '',
        idType: widget.selectedMethod,
        file: '',
        selfie: _capturedFile!.path,
        status: '',
        adminRemark: '',
      );

      BlocProvider.of<IdverificationBloc>(context).add(UploadSelfie(selfieDoc));
      
      setState(() {
        _isSelfieUploaded = true; // Mark selfie as uploaded
      });
    }
  }

  void _submitDocuments() {
    BlocProvider.of<IdverificationBloc>(context).add(SubmitIdDocuments());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Selfie Capture'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _capturedFile == null
          ? _buildCameraPreview()
          : _buildPreviewScreen(),
    );
  }

  Widget _buildCameraPreview() {
    if (!_isInitialized) {
      return const Center(child: CircularProgressIndicator());
    }
    return Stack(
      children: [
        CameraPreview(_cameraController!),
        Center(
          child: Container(
            width: 300,
            height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 4),
            ),
          ),
        ),
        Align(
          alignment: Alignment.bottomCenter,
          child: Padding(
            padding: const EdgeInsets.only(bottom: 30),
            child: FloatingActionButton(
              backgroundColor: Colors.green,
              child: const Icon(Icons.camera_alt),
              onPressed: _captureSelfie,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPreviewScreen() {
    return Column(
      children: [
        Expanded(
          child: Image.file(
            File(_capturedFile!.path),
            fit: BoxFit.contain,
          ),
        ),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton(
              child: const Text('Retake'),
              onPressed: () {
                setState(() {
                  _capturedFile = null;
                });
              },
            ),
            ElevatedButton(
              onPressed: _isSelfieUploaded ? _submitDocuments : _uploadSelfie,
              child: Text(_isSelfieUploaded ? 'Submit Documents' : 'Upload Selfie'),
            ),
          ],
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}
