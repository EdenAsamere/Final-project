import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equbapp/blocs/profile/profile_bloc.dart';
import 'package:equbapp/blocs/profile/profile_event.dart';
import 'package:equbapp/blocs/profile/profile_state.dart';
import 'package:equbapp/models/user_profile.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ProfileBloc>().add(LoadProfile());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: BlocConsumer<ProfileBloc, ProfileState>(
            listener: (context, state) {
              if (state is ProfileFailure) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(state.error), backgroundColor: Colors.red),
                );
              }
            },
            builder: (context, state) {
              if (state is ProfileLoading) {
                return const Center(child: CircularProgressIndicator());
              } else if (state is ProfileSuccess) {
                return _buildProfileBody(state.profile, context);
              } else if (state is ProfileFailure) {
                return const Center(child: Text("Error loading profile"));
              }
              return const Center(child: Text("Press the button to load profile"));
            },
          ),
        ),
      ),
    );
  }

  Widget _buildProfileBody(UserProfile profile, BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            const Text(
              "Profile",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),

            // Profile Header
            Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.green,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const CircleAvatar(radius: 30, backgroundColor: Colors.white),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "${profile.firstName} ${profile.lastName}",
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit, color: Colors.white),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Profile Menu List
            ProfileMenuItem(
              icon: Icons.person_outline,
              title: "Personal information",
              subtitle: "${profile.firstName} ${profile.lastName}, ${profile.email}",
              onTap: () {},
            ),
            ProfileMenuItem(
              icon: Icons.groups_outlined,
              title: "Equb groups",
              subtitle: "Joined and created equb groups",
              onTap: () {},
            ),
            ProfileMenuItem(
              icon: Icons.swap_vert,
              title: "Recent transactions",
              subtitle: "Contributions and payouts to equbs",
              onTap: () {},
            ),
            ProfileMenuItem(
              icon: Icons.upload_file_outlined,
              title: "Upload Collaterals",
              subtitle: "Upload collateral files to equbs",
              onTap: () {
                try {
                  Navigator.of(context).pushNamed('/upload-collaterals');
                } catch (e) {
                  print("Navigation error: $e");
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Failed to navigate!"), backgroundColor: Colors.red),
                  );
                }
              },

            ),
            ProfileMenuItem(
              icon: Icons.error_outline,
              title: "Penalty Points",
              subtitle: profile.penaltyPoints.toString(),
              onTap: () {},
            ),
            ProfileMenuItem(
              icon: Icons.logout,
              title: "Log out",
              subtitle: "Further secure your account for safety",
              onTap: () {
                _handleLogout(context);
              },
            ),

            const SizedBox(height: 20),

            // More Section
            const Text("More", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            ProfileMenuItem(
              icon: Icons.notifications_none,
              title: "Help & Support",
              subtitle: "",
              onTap: () {},
            ),
            ProfileMenuItem(
              icon: Icons.help_outline,
              title: "FAQ",
              subtitle: "",
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }

  void _handleLogout(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Logging out..."), backgroundColor: Colors.blue),
    );
  }
}

// Custom Menu Item Widget
class ProfileMenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  const ProfileMenuItem({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: Colors.grey[200],
        child: Icon(icon, color: Colors.black54),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: subtitle.isNotEmpty ? Text(subtitle, style: const TextStyle(color: Colors.grey)) : null,
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }
}
