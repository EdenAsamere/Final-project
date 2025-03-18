import 'dart:io';
import 'package:equbapp/blocs/idVerification/idverification_bloc.dart';
import 'package:equbapp/blocs/idVerification/idverification_event.dart';
import 'package:equbapp/models/IdVerificationDocument_model.dart';
import 'package:equbapp/screens/selfiecapture_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

class IDUploadScreen extends StatefulWidget {
  final String selectedMethod;

  const IDUploadScreen({Key? key, required this.selectedMethod}) : super(key: key);

  @override
  _IDUploadScreenState createState() => _IDUploadScreenState();
}

class _IDUploadScreenState extends State<IDUploadScreen> {
  File? _frontId;
  File? _backId;
  bool _isUploading = false;

  final ImagePicker _picker = ImagePicker();

  Future<void> _pickOrTakePhoto(bool isFront, bool fromCamera) async {
    final XFile? pickedFile = await _picker.pickImage(
      source: fromCamera ? ImageSource.camera : ImageSource.gallery,
    );

    if (pickedFile != null) {
      setState(() {
        if (isFront) {
          _frontId = File(pickedFile.path);
        } else {
          _backId = File(pickedFile.path);
        }
      });
    }
  }

  void _startUpload() async {
    if (_frontId != null && _backId != null) {
      setState(() => _isUploading = true);

      final idDocument = IdVerificationDocument(
        id: '',
        userId: '',
        idType: widget.selectedMethod,
        frontId: _frontId!.path,
        backId: _backId!.path,
        selfie: '',
        status: '',
        adminRemark: '',
      );

      BlocProvider.of<IdverificationBloc>(context).add(UploadIdVerificationDocument(idDocument));
      
      // Save progress (user is moving to the Selfie Capture step)
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('verification_step', 'take-selfie');

      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => SelfieCaptureScreen(selectedMethod: widget.selectedMethod)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Upload ID Documents')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildImageSection(true, _frontId, 'Front Side'),
            const SizedBox(height: 20),
            _buildImageSection(false, _backId, 'Back Side'),
            if (_frontId != null && _backId != null) ...[
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isUploading ? null : _startUpload,
                child: const Text('Submit ID Documents'),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildImageSection(bool isFront, File? imageFile, String label) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Container(
          width: 150,
          height: 150,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey),
            borderRadius: BorderRadius.circular(10),
          ),
          child: imageFile == null
              ? const Center(child: Text('No Image'))
              : Image.file(imageFile, fit: BoxFit.cover),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton.icon(
              onPressed: () => _pickOrTakePhoto(isFront, false),
              icon: const Icon(Icons.image),
              label: const Text('Pick Image'),
            ),
            const SizedBox(width: 10),
            ElevatedButton.icon(
              onPressed: () => _pickOrTakePhoto(isFront, true),
              icon: const Icon(Icons.camera),
              label: const Text('Take Photo'),
            ),
          ],
        ),
      ],
    );
  }
}
