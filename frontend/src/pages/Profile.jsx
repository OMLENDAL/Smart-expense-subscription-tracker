// This page provides the user profile view for the app.
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h2>Profile</h2>
      <div className="card">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>
  );
}

export default Profile;
