import 'dart:io' as io;
import 'package:equbapp/blocs/collateral/collateral_state.dart';
import 'package:equbapp/blocs/collateral/collateral_event.dart';
import 'package:equbapp/blocs/collateral/collateral_bloc.dart';
import 'package:equbapp/models/collateral_model.dart';
import 'package:equbapp/screens/displayimage_screen.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';

class UploadCollateralScreen extends StatefulWidget {
  @override
  _UploadCollateralScreenState createState() => _UploadCollateralScreenState();
}

class _UploadCollateralScreenState extends State<UploadCollateralScreen> {
  io.File? _selectedFile;
  String? _selectedDocumentType;
  final ImagePicker _imagePicker = ImagePicker();
  bool _isUploading = false;

  // Local map to store collaterals keyed by document type.
  Map<String, Collateral> uploadedCollateralMap = {};

  final List<Map<String, dynamic>> documentTypes = [
    {"name": "Bank Statement", "icon": Icons.receipt_long},
    {"name": "Land deeds", "icon": Icons.landscape},
    {"name": "Car ownership", "icon": Icons.directions_car},
    {"name": "House ownership", "icon": Icons.home},
    {"name": "Business license", "icon": Icons.business},
    {"name": "Employment contract", "icon": Icons.badge},
  ];

  @override
  void initState() {
    super.initState();
    // Fetch all collaterals via bloc.
    BlocProvider.of<CollateralBloc>(context).add(FetchAllCollaterals());
  }

  /// Shows options for initial upload.
  Future<void> showUploadOptions(String documentType) async {
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
                  _takePhoto(documentType);
                },
              ),
              ListTile(
                leading: const Icon(Icons.upload_file),
                title: const Text("Upload from Device"),
                onTap: () {
                  Navigator.pop(context);
                  _pickFile(documentType);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  /// Shows reupload options for updating an existing collateral.
  Future<void> showReuploadOptions(String documentType) async {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text("Take a New Picture"),
                onTap: () {
                  Navigator.pop(context);
                  _takePhotoForUpdate(documentType);
                },
              ),
              ListTile(
                leading: const Icon(Icons.upload_file),
                title: const Text("Upload New File"),
                onTap: () {
                  Navigator.pop(context);
                  _pickFileForUpdate(documentType);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickFile(String documentType) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result != null) {
      setState(() {
        _selectedDocumentType = documentType;
        _selectedFile = io.File(result.files.single.path!);
      });
      _uploadFile();
    }
  }

  Future<void> _takePhoto(String documentType) async {
    final XFile? photo = await _imagePicker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      setState(() {
        _selectedDocumentType = documentType;
        _selectedFile = io.File(photo.path);
      });
      _uploadFile();
    }
  }

  /// Called for new uploads.
  void _uploadFile() {
    if (_selectedFile != null && _selectedDocumentType != null) {
      setState(() {
        _isUploading = true;
      });
      final collateral = Collateral(
        id: "",
        file: _selectedFile!.path,
        documentType: _selectedDocumentType!,
        status: "",
      );
      BlocProvider.of<CollateralBloc>(context).add(UploadCollateral(collateral));
    }
  }

  Future<void> _pickFileForUpdate(String documentType) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result != null) {
      setState(() {
        _selectedDocumentType = documentType;
        _selectedFile = io.File(result.files.single.path!);
      });
      _updateFile();
    }
  }

  Future<void> _takePhotoForUpdate(String documentType) async {
    final XFile? photo = await _imagePicker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      setState(() {
        _selectedDocumentType = documentType;
        _selectedFile = io.File(photo.path);
      });
      _updateFile();
    }
  }

  /// Called when updating an existing collateral.
  void _updateFile() {
    if (_selectedFile != null &&
        _selectedDocumentType != null &&
        uploadedCollateralMap.containsKey(_selectedDocumentType)) {
      setState(() {
        _isUploading = true;
      });
      final existingCollateral = uploadedCollateralMap[_selectedDocumentType]!;
      final updatedCollateral = Collateral(
        id: existingCollateral.id,
        file: _selectedFile!.path,
        documentType: _selectedDocumentType!,
        status: "",
      );
      BlocProvider.of<CollateralBloc>(context).add(UpdateCollateral(updatedCollateral));
    }
  }

  // Open the image inside the app.
  void _openFile(String url) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DisplayImageScreen(imageUrl: url),
      ),
    );
  }

  Color _getStatusColor(String? status) {
  switch (status) {
    case 'verified':
      return Colors.green;
    case 'pending':
      return Colors.orange;
    case 'rejected':
      return Colors.red;
    default:
      return Colors.grey;
  }
}

  // Called from the edit bottom sheet.
  void _onEditPressed(String documentType) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.remove_red_eye),
              title: const Text("View Document"),
              onTap: () {
                Navigator.pop(context);
                _openFile(uploadedCollateralMap[documentType]!.file);
              },
            ),
            ListTile(
              leading: const Icon(Icons.refresh),
              title: const Text("Replace Document"),
              onTap: () {
                Navigator.pop(context);
                // Instead of calling the regular upload options,
                // call the reupload options that update the collateral.
                showReuploadOptions(documentType);
              },
            ),
            // Additional options (like Delete) can be added here.
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Upload Collaterals")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocConsumer<CollateralBloc, CollateralState>(
          listener: (context, state) {
            if (state is CollateralSuccess) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Uploading successful"), backgroundColor: Colors.green),
              );
              // Refresh list after upload or update.
              BlocProvider.of<CollateralBloc>(context).add(FetchAllCollaterals());
              setState(() {
                _selectedFile = null;
                _selectedDocumentType = null;
                _isUploading = false;
              });
            } else if (state is CollateralFailure) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Error: ${state.error}"), backgroundColor: Colors.red),
              );
              setState(() {
                _isUploading = false;
              });
            } else if (state is CollateralListSuccess) {
              setState(() {
                uploadedCollateralMap = {
                  for (var collateral in state.collaterals)
                    collateral.documentType: collateral
                };
              });
            }
          },
          builder: (context, state) {
            if (state is CollateralLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            return ListView.builder(
              itemCount: documentTypes.length,
              itemBuilder: (context, index) {
                var doc = documentTypes[index];
                String docName = doc["name"];
                bool isUploaded = uploadedCollateralMap.containsKey(docName);
                return Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                    
                  ),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(0, 16, 9, 16),
                    child: ListTile(
                      leading: Icon(doc["icon"], color: const Color.fromARGB(255, 123, 230, 0), size: 20),
                      title: Text(
                        docName,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: isUploaded
                          ? 
                          Column( 
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              GestureDetector(
                              onTap: () =>
                                  _openFile(uploadedCollateralMap[docName]!.file),
                              child: const Text(
                                "View Document",
                                style: TextStyle(
                                  color: Color.fromARGB(255, 123, 230, 0),
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                      
                            ], 
                          )
              
                          : null,
                    trailing: _isUploading && _selectedDocumentType == docName
    ? const CircularProgressIndicator()
    : Container(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Transform.translate(
              offset: const Offset(15, -15),
              child: Text(
                uploadedCollateralMap[docName]?.status ?? 'Not uploaded',
                style: TextStyle(
                  fontSize: 12,
                  color: _getStatusColor(uploadedCollateralMap[docName]?.status),
                ),
              ),
            ),
            const SizedBox(height: 4),
            SizedBox(
              height: 27,
              child: Transform.translate(
                offset: const Offset(15, 0),
                child: TextButton(
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    backgroundColor: isUploaded 
                        ? const Color.fromARGB(255, 123, 230, 0).withOpacity(0.1)
                        : null,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                      side: BorderSide(
                        color: isUploaded 
                            ? const Color.fromARGB(255, 123, 230, 0)
                            : Colors.transparent,
                        width: isUploaded ? 1.0 : 0.0,
                      ),
                    ),
                  ),
                  onPressed: () {
                    if (isUploaded) {
                      _onEditPressed(docName);
                    } else {
                      showUploadOptions(docName);
                    }
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isUploaded ? Icons.edit : Icons.upload,
                        size: 16,
                        color: isUploaded 
                            ? const Color.fromARGB(255, 123, 230, 0)
                            : Colors.grey[700],
                      ),
                      const SizedBox(width: 6),
                      Text(
                        isUploaded ? 'Update' : 'Upload',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: isUploaded 
                              ? const Color.fromARGB(255, 123, 230, 0)
                              : Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
                          
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}


