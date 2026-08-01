import useAuth from "../hooks/useAuth";
import Avatar from "../components/Avatar";
import "../styles/profile.css";

function Profile() {
    const { auth } = useAuth();

    const user = auth.user;

    return (
        <div className="profile-page">
            <div className="profile-card">

                <Avatar
                    username={user.username}
                    size="lg"
                />

                <h2>{user.username}</h2>

                <div className="profile-info">

                    <div className="info-row">
                        <span>Email</span>
                        <p>{user.email}</p>
                    </div>

                    <div className="info-row">
                        <span>User ID</span>
                        <p>{user.id}</p>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Profile;