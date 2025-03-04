import 'dart:io';
import 'package:equbapp/blocs/idVerification/idverification_bloc.dart';
import 'package:equbapp/blocs/idVerification/idverification_event.dart';
import 'package:equbapp/blocs/idVerification/idverification_state.dart';
import 'package:equbapp/models/IdVerificationDocument_model.dart';
import 'package:equbapp/screens/selfiecapture_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';

// IDUploadScreen: Uploads the document. After successful upload,
// a button appears to allow the user to continue to selfie capture.
class IDUploadScreen extends StatefulWidget {
  final String selectedMethod;

  const IDUploadScreen({super.key, required this.selectedMethod});

  @override
  State<IDUploadScreen> createState() => _IDUploadScreenState();
}

class _IDUploadScreenState extends State<IDUploadScreen> {
  File? _selectedFile;
  final ImagePicker _imagePicker = ImagePicker();
  bool _isUploading = false;
  bool _documentUploaded = false; // Flag for successful upload

  Future<void> _showUploadOptions() async {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text("Take a Picture"),
                onTap: () {
                  Navigator.pop(context);
                  _takePhoto();
                },
              ),
              ListTile(
                leading: const Icon(Icons.upload_file),
                title: const Text("Upload from Device"),
                onTap: () {
                  Navigator.pop(context);
                  _pickFile();
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result != null) {
      setState(() {
        _selectedFile = File(result.files.single.path!);
      });
      _startUpload();
    }
  }

  Future<void> _takePhoto() async {
    final XFile? photo =
        await _imagePicker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      setState(() {
        _selectedFile = File(photo.path);
      });
      _startUpload();
    }
  }

  void _startUpload() {
    if (_selectedFile != null) {
      setState(() => _isUploading = true);

      final idDocument = IdVerificationDocument(
        id: '',
        userId: '',
        selfie: '',
        file: _selectedFile!.path,
        status: '',
        idType: widget.selectedMethod,
        adminRemark: '',
      );

      BlocProvider.of<IdverificationBloc>(context)
          .add(UploadIdVerificationDocument(idDocument));
    }
  }

  void _viewDocument() {
    if (_selectedFile != null) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => Scaffold(
            appBar: AppBar(title: const Text("Document Preview")),
            body: Center(
              child: Image.file(_selectedFile!),
            ),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upload ID'),
      ),
      body: BlocConsumer<IdverificationBloc, IdVerificationState>(
        listener: (context, state) {
          if (state is IdVerificationSuccess) {
            setState(() {
              _isUploading = false;
              _documentUploaded = true;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.green.shade700,
              ),
            );
          } else if (state is IdVerificationFailure) {
            setState(() {
              _isUploading = false;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.error),
                backgroundColor: Colors.red.shade700,
              ),
            );
          } else if (state is IdVerificationLoading) {
            setState(() {
              _isUploading = true;
            });
          }
        },
        builder: (context, state) {
          return SingleChildScrollView(
            padding:
                const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Verify your ${widget.selectedMethod}',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Please capture or upload a clear image of your ${widget.selectedMethod} for verification.',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 40),
                if (_selectedFile != null) ...[
                  ListTile(
                    leading: const Icon(Icons.description, color: Colors.green),
                    title: const Text(
                      'Selected document',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(_selectedFile!.path.split('/').last),
                    trailing: IconButton(
                      icon: const Icon(Icons.visibility),
                      onPressed: _viewDocument,
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
                ElevatedButton.icon(
                  onPressed: _isUploading ? null : _showUploadOptions,
                  icon: Icon(
                    _isUploading ? Icons.loop : Icons.upload,
                    size: 24,
                  ),
                  label: Text(
                    _isUploading
                        ? 'Uploading...'
                        : _selectedFile == null
                            ? 'Select Document'
                            : 'Re-upload Document',
                    style: const TextStyle(fontSize: 16),
                  ),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    backgroundColor:
                        _isUploading ? Colors.grey : Colors.green,
                  ),
                ),
                if (_documentUploaded) ...[
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => SelfieCaptureScreen(
                            selectedMethod: widget.selectedMethod,
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      backgroundColor: Colors.green,
                    ),
                    child: const Text('Continue to Selfie Capture'),
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}
